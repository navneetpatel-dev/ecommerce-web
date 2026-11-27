#!/usr/bin/env node
/**
 * Opens every page (and its menus, dialogs and tabs) in headless Chrome at phone, tablet and
 * desktop widths and lists what overflows. Run against the local dev server:
 *
 *   AUDIT_ADMIN_EMAIL=… AUDIT_ADMIN_PASSWORD=… npm run audit:responsive
 *
 * Same pair for VENDOR and CUSTOMER; a role without credentials is skipped.
 * Options: --out=<dir>  --only=<route substring>  --no-overlays
 *
 * Read-only: every request that could change data is blocked, apart from signing in.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launchChrome, sleep } from "./lib/cdp.mjs";
import { probe } from "./lib/responsive-probe.mjs";
import {
  listRoutes,
  resolveDynamic,
  roleFor,
} from "./lib/responsive-routes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => arg.replace(/^--/, "").split("=")),
);
const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:5273";
const OUT = path.resolve(
  args.out ?? path.join(os.tmpdir(), "responsive-audit"),
);
const WIDTHS = [320, 360, 390, 768, 1280];
const OVERLAY_WIDTHS = [320, 390, 768];
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const SIGN_IN = /\/auth\/(login|refresh)(\?|$)/;
const OPENERS =
  /^(add|create|new|edit|invite|issue|generate|bulk|send|upload|import|change|manage|write|ask|answer|respond|redeem|top ?up|report|request|schedule|configure|compose|preview|view|filters?|show|more|columns|sort|export|save view|menu|track|return|cancel|delete|remove|reject|approve)/i;

if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE)) {
  console.error("The audit only runs against a local server.");
  process.exit(1);
}

const results = [];
const skipped = [];
/* Which menus, dialogs and tabs really opened, so a quiet page can be told from an unchecked one. */
const opened = {};
let blocked = 0;
let rateLimitedUntil = 0;

const chrome = await launchChrome();

async function openTab() {
  const { browserContextId } = await chrome.send("Target.createBrowserContext");
  const { targetId } = await chrome.send("Target.createTarget", {
    url: "about:blank",
    browserContextId,
  });
  const { sessionId } = await chrome.send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  const send = (method, params) => chrome.send(method, params, sessionId);
  const tab = {
    send,
    inflight: new Set(),
    responses: [],
    lastChange: Date.now(),
  };

  chrome.on((event) => {
    if (event.sessionId !== sessionId) return;
    const { method, params } = event;
    if (method === "Fetch.requestPaused") {
      const allowed =
        SAFE_METHODS.has(params.request.method) ||
        SIGN_IN.test(params.request.url);
      if (!allowed) blocked += 1;
      send(allowed ? "Fetch.continueRequest" : "Fetch.failRequest", {
        requestId: params.requestId,
        ...(allowed ? {} : { errorReason: "BlockedByClient" }),
      }).catch(() => {});
    } else if (
      method === "Network.requestWillBeSent" &&
      /^(XHR|Fetch|Document|Script)$/.test(params.type)
    ) {
      tab.inflight.add(params.requestId);
    } else if (method === "Network.responseReceived") {
      if (params.response.status === 429)
        rateLimitedUntil = Date.now() + 60_000;
      if (params.response.url.includes("/api/") && params.type !== "Document") {
        tab.responses.push(params.requestId);
      }
    } else if (
      method === "Network.loadingFinished" ||
      method === "Network.loadingFailed"
    ) {
      tab.inflight.delete(params.requestId);
      tab.lastChange = Date.now();
    } else if (method === "Page.javascriptDialogOpening") {
      send("Page.handleJavaScriptDialog", { accept: false }).catch(() => {});
    }
  });

  await send("Page.enable");
  await send("Page.bringToFront");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setBypassServiceWorker", { bypass: true });
  await send("Fetch.enable", { patterns: [{ urlPattern: "*" }] });
  tab.close = () =>
    chrome.send("Target.disposeBrowserContext", { browserContextId });
  await chrome.send("Browser.setDownloadBehavior", {
    behavior: "deny",
    browserContextId,
  });

  tab.evaluate = async (expression) => {
    const { result } = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return result.value;
  };
  tab.resize = async (width) => {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width < 700 ? 720 : 900,
      deviceScaleFactor: 1,
      mobile: width < 700,
    });
    await sleep(350);
  };
  tab.settle = async (max = 20_000) => {
    const start = Date.now();
    await sleep(600);
    while (Date.now() - start < max) {
      const quiet =
        tab.inflight.size === 0 && Date.now() - tab.lastChange > 500;
      const busy = await tab
        .evaluate(
          "document.readyState !== 'complete' || !!document.querySelector('.animate-pulse')",
        )
        .catch(() => true);
      if (quiet && !busy) break;
      await sleep(300);
    }
    await sleep(300);
  };
  tab.goto = async (route) => {
    if (rateLimitedUntil > Date.now()) {
      console.log("  rate limited, waiting…");
      await sleep(rateLimitedUntil - Date.now());
    }
    tab.inflight.clear();
    tab.responses = [];
    await send("Page.navigate", { url: BASE + route });
    await tab.settle();
  };
  tab.key = async (key) => {
    const code = key === "Escape" ? 27 : 0;
    for (const type of ["keyDown", "keyUp"]) {
      await send("Input.dispatchKeyEvent", {
        type,
        key,
        code: key,
        windowsVirtualKeyCode: code,
      });
    }
    await sleep(350);
  };
  return tab;
}

async function signIn(tab, role) {
  const prefix = `AUDIT_${role.toUpperCase()}`;
  const email = process.env[`${prefix}_EMAIL`];
  const password = process.env[`${prefix}_PASSWORD`];
  if (!email || !password) return false;
  await tab.resize(1280);
  await tab.goto("/login");
  await tab.evaluate(`(() => {
    const set = (el, value) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
    };
    set(document.querySelector("input[type=email], #email"), ${JSON.stringify(email)});
    set(document.querySelector("input[type=password], #password"), ${JSON.stringify(password)});
    document.querySelector("form [type=submit]").click();
  })()`);
  for (let i = 0; i < 60; i += 1) {
    await sleep(500);
    if (
      !(await tab
        .evaluate("location.pathname.startsWith('/login')")
        .catch(() => true))
    ) {
      await tab.settle();
      return true;
    }
  }
  return false;
}

const seenFindings = new Set();

const report = () =>
  JSON.stringify(
    { results, skipped, blocked, opened },
    (key, value) => (value instanceof Set ? [...value] : value),
    2,
  );

async function measure(tab, route, state, width) {
  /* Popovers reposition on animation frames, which headless Chrome only produces when asked. */
  await tab.send("Page.captureScreenshot", { format: "jpeg", quality: 1 });
  /* Background tabs produce no frames, so never wait on one without a time limit. */
  await tab.evaluate(
    "new Promise((done) => { requestAnimationFrame(() => requestAnimationFrame(done)); setTimeout(done, 500); })",
  );
  await sleep(150);
  const found = (await tab.evaluate(`(${probe.toString()})()`)) ?? [];
  const fresh = found.filter((item) => {
    const id = [route, item.type, item.el, width].join("|");
    if (seenFindings.has(id)) return false;
    seenFindings.add(id);
    return true;
  });
  if (fresh.length === 0) return;
  const name =
    `${route}_${state}_${width}`.replace(/[^a-z0-9]+/gi, "-").slice(0, 120) +
    ".png";
  const { data } = await tab.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(OUT, name), Buffer.from(data, "base64"));
  results.push({ route, state, width, screenshot: name, findings: fresh });
}

async function sweepWidths(tab, route, state, widths) {
  for (const width of widths) {
    await tab.resize(width);
    await measure(tab, route, state, width);
  }
}

/* Visible, closed-by-default triggers, tagged so they can be clicked one at a time. */
const TAG_TRIGGERS = `(() => {
  const visible = (el) => el.getBoundingClientRect().width > 0 && !el.disabled && !el.closest("[aria-hidden=true]");
  const seen = new Set();
  let count = 0;
  for (const el of document.querySelectorAll("button, [role=tab], [role=combobox], summary")) {
    if (!visible(el)) continue;
    const name = (el.getAttribute("aria-label") || el.innerText || "").trim();
    const wanted = el.matches("[role=tab], [aria-haspopup], [data-row-actions-trigger], summary") || ${OPENERS}.test(name);
    const key = el.matches("[data-row-actions-trigger]") ? "row-menu" : name.slice(0, 40) || el.className;
    if (!wanted || seen.has(key) || el.type === "submit") continue;
    seen.add(key);
    el.setAttribute("data-audit-trigger", String(count++));
    if (count >= 24) break;
  }
  return [...seen];
})()`;

const click = (
  selector,
) => `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.scrollIntoView({ block: "center" });
  for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup"]) el.dispatchEvent(new (type.startsWith("pointer") ? PointerEvent : MouseEvent)(type, { bubbles: true, button: 0 }));
  el.click(); return true; })()`;
const OVERLAY_OPEN =
  "!!document.querySelector('[role=dialog], [role=listbox], [role=menu], [data-radix-popper-content-wrapper]')";

async function explore(tab, route, target) {
  for (const width of [390, 1280]) {
    await tab.resize(width);
    await tab.goto(target);
    const names = await tab.evaluate(TAG_TRIGGERS);
    for (let index = 0; index < (names?.length ?? 0); index += 1) {
      const label = names[index].slice(0, 30);
      if (width === 1280 && label !== "row-menu") continue;
      await tab.resize(width);
      if (!(await tab.evaluate(click(`[data-audit-trigger="${index}"]`)))) {
        continue;
      }
      await sleep(700);
      await tab.settle(6000);
      if (await tab.evaluate(OVERLAY_OPEN)) {
        (opened[route] ??= new Set()).add(label);
      }
      await sweepWidths(tab, route, `open-${label}`, OVERLAY_WIDTHS);
      await exploreNested(tab, route, label);
      if (label === "row-menu")
        await exploreRowMenu(tab, route, target, width, index);
      await closeOverlays(tab, target);
    }
  }
}

/* Dropdowns that only exist inside an open dialog, such as a category picker in a form. */
const TAG_NESTED = `(() => {
  const found = [...document.querySelectorAll("[role=dialog] button[aria-haspopup], [role=dialog] [role=combobox]")]
    .filter((el) => el.getBoundingClientRect().width > 0 && !el.disabled && el.getAttribute("aria-expanded") !== "true")
    .slice(0, 6);
  found.forEach((el, index) => el.setAttribute("data-audit-nested", String(index)));
  return found.map((el) => (el.innerText || el.getAttribute("aria-label") || "dropdown").trim().slice(0, 24));
})()`;

async function exploreNested(tab, route, parent) {
  await tab.resize(390);
  const names = (await tab.evaluate(TAG_NESTED)) ?? [];
  for (let index = 0; index < names.length; index += 1) {
    await tab.resize(390);
    if (!(await tab.evaluate(click(`[data-audit-nested="${index}"]`))))
      continue;
    await sleep(500);
    await tab.settle(6000);
    (opened[route] ??= new Set()).add(`${parent} > ${names[index]}`);
    await sweepWidths(
      tab,
      route,
      `in-${parent}-${names[index]}`,
      OVERLAY_WIDTHS,
    );
    await tab.key("Escape");
  }
}

async function exploreRowMenu(tab, route, target, width, index) {
  await tab.resize(width);
  await closeOverlays(tab, target);
  await tab.evaluate(click(`[data-audit-trigger="${index}"]`));
  await sleep(500);
  const items = await tab.evaluate(
    "[...document.querySelectorAll('[data-row-action]')].map((e) => e.innerText.trim())",
  );
  for (let item = 0; item < (items?.length ?? 0); item += 1) {
    await tab.resize(width);
    await closeOverlays(tab, target);
    if (!(await tab.evaluate(click(`[data-audit-trigger="${index}"]`)))) {
      await tab.evaluate(TAG_TRIGGERS);
      await tab.evaluate(click(`[data-audit-trigger="${index}"]`));
    }
    await sleep(500);
    await tab.evaluate(
      `document.querySelectorAll('[data-row-action]')[${item}]?.click()`,
    );
    await sleep(800);
    await tab.settle(6000);
    const name = items[item].slice(0, 24);
    await sweepWidths(tab, route, `menu-${name}`, OVERLAY_WIDTHS);
    await exploreNested(tab, route, name);
  }
}

async function closeOverlays(tab, target) {
  for (
    let i = 0;
    i < 3 && (await tab.evaluate(OVERLAY_OPEN).catch(() => false));
    i += 1
  ) {
    await tab.key("Escape");
  }
  const moved = await tab
    .evaluate("location.pathname + location.search")
    .catch(() => "");
  const stuck = await tab.evaluate(OVERLAY_OPEN).catch(() => false);
  if (stuck || moved.split("?")[0] !== target.split("?")[0]) {
    await tab.goto(target);
    await tab.evaluate(TAG_TRIGGERS);
  }
}

async function remember(tab, route, seen) {
  const links = await tab.evaluate(
    "[...document.querySelectorAll('a[href^=\"/\"]')].map((a) => a.getAttribute('href'))",
  );
  seen.links.push(...(links ?? []));
  for (const requestId of tab.responses) {
    const body = await tab
      .send("Network.getResponseBody", { requestId })
      .catch(() => null);
    if (!body) continue;
    let data;
    try {
      data = JSON.parse(body.body).data;
    } catch {
      continue;
    }
    const list = Array.isArray(data) ? data : data?.items;
    const first = Array.isArray(list) ? list.find((row) => row?.id) : null;
    if (first && !seen.records[route]) seen.records[route] = first;
  }
}

mkdirSync(OUT, { recursive: true });
const routes = listRoutes(path.join(root, "src/app"));
const seen = { links: [], records: {} };

for (const role of ["guest", "customer", "vendor", "admin"]) {
  const mine = routes
    .filter((route) => roleFor(route) === role)
    .sort((a, b) => Number(a.includes("[")) - Number(b.includes("[")));
  const wanted = mine.filter(
    (route) => !args.only || route.includes(args.only),
  );
  if (wanted.length === 0) continue;
  const tab = await openTab();
  if (role !== "guest" && !(await signIn(tab, role))) {
    skipped.push(...wanted.map((route) => `${route} (no ${role} sign-in)`));
    continue;
  }
  console.log(`== ${role}: ${wanted.length} pages`);
  if (role === "guest" && args.only) {
    for (const parent of ["/", "/products", "/vendors", "/help", "/blog"]) {
      await tab.goto(parent);
      await remember(tab, parent, seen);
    }
  }
  for (const route of wanted) {
    const target = resolveDynamic(route, seen);
    if (!target) {
      skipped.push(`${route} (no record to open)`);
      continue;
    }
    try {
      await tab.resize(390);
      await tab.goto(target);
      await remember(tab, route, seen);
      const landed = await tab.evaluate("location.pathname");
      if (landed !== target.split("?")[0]) {
        skipped.push(`${route} (redirected to ${landed})`);
        continue;
      }
      await sweepWidths(tab, route, "page", WIDTHS);
      if (!("no-overlays" in args)) await explore(tab, route, target);
      const count = results
        .filter((r) => r.route === route)
        .reduce((n, r) => n + r.findings.length, 0);
      console.log(
        `  ${count ? "✗" : "✓"} ${route}${count ? ` (${count})` : ""}`,
      );
    } catch (error) {
      skipped.push(`${route} (${error.message})`);
      console.log(`  ! ${route}: ${error.message}`);
    }
    writeFileSync(path.join(OUT, "report.json"), report());
  }
  await tab.close();
}

chrome.close();
writeFileSync(path.join(OUT, "report.json"), report());
const total = results.reduce((n, r) => n + r.findings.length, 0);
console.log(
  `\n${total} findings on ${new Set(results.map((r) => r.route)).size} pages; ${blocked} write requests blocked; ${skipped.length} skipped.`,
);
console.log(`Report: ${path.join(OUT, "report.json")}`);
process.exit(0);
