#!/usr/bin/env node
/**
 * Guardrail: anything pinned to a viewport edge must respect the device's safe
 * area. `viewport-fit=cover` (see ROOT_VIEWPORT) removes the browser's own
 * insets, so a `fixed`/`sticky`/`absolute` element flush to an edge renders
 * under the status bar, notch or home indicator unless its class list carries
 * the matching `env(safe-area-inset-*)`.
 *
 * Rule: a line that pins an edge (`fixed`/`sticky`/`absolute` plus `top-0`,
 * `bottom-0`, `left-0`, `right-0` or their `[…]` variants) must mention the
 * matching inset token on the same line — either as positioning
 * (`bottom-[calc(4rem+env(safe-area-inset-bottom,0px))]`) or as padding
 * (`pb-[calc(1rem+env(safe-area-inset-bottom,0px))]`).
 *
 * Deliberate exceptions:
 *   - `pointer-events-none` decorative gradients may bleed under the bars.
 *   - `inset-0` backdrops are meant to cover the whole screen; the panel or
 *     sheet rendered inside them is checked instead.
 *   - The allowlist below for elements whose inset is applied by an inline
 *     style or inherited from a padded ancestor.
 *
 * Pure Node (no ripgrep), so it runs the same on CI runners and dev machines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

const skippedPathParts = [`${path.sep}__tests__${path.sep}`];

/**
 * The rail offsets live in one module so a tab-bar height change can't leave a
 * stale copy behind. `shared/` may not import from `features/` (Rule 15), so
 * this is checked here rather than by a unit test.
 */
const RAIL_OFFSETS_SOURCE = "shared/constants/layout/mobileRails.ts";
const railOffsetPatterns = [
  /pb-\[calc\(3\.5rem\+env\(safe-area-inset-bottom/,
  /bottom-\[calc\(3\.5rem\+env\(safe-area-inset-bottom/,
  /bottom-\[calc\(4rem\+env\(safe-area-inset-bottom/,
];

/** `edge` is the axis token, `inset` the env() token that satisfies it. */
const EDGES = [
  { edge: /(^|[\s"'`])top-0(?![\d.])/, inset: "env(safe-area-inset-top" },
  {
    edge: /(^|[\s"'`])bottom-0(?![\d.])/,
    inset: "env(safe-area-inset-bottom",
  },
  { edge: /(^|[\s"'`])left-0(?![\d.])/, inset: "env(safe-area-inset-left" },
  {
    edge: /(^|[\s"'`])right-0(?![\d.])/,
    inset: "env(safe-area-inset-right",
  },
];

/** Axes that can pin to the viewport when an element is `sticky`. */
const STICKY_AXES = new Set([
  "env(safe-area-inset-top",
  "env(safe-area-inset-bottom",
]);

const POSITIONED = /(^|[\s"'`])(fixed|sticky|absolute)(\s|$)/;

/** A module with a `fixed inset-0` overlay wrapper: any `absolute` panel in it
 * is positioned against the viewport, so its edge pins need safe-area offsets. */
const hasOverlayWrapper = (lines) =>
  lines.some(
    (line) =>
      !isCommentLine(line) &&
      /(^|[\s"'`])fixed(\s|$)/.test(line) &&
      /(^|[\s"'`])inset-0(\s|$)/.test(line),
  );

/** Skip decorative layers that are allowed to run under the system bars. */
const skippedLinePatterns = [/pointer-events-none/, /(^|[\s"'`])inset-0(\s|$)/];

/**
 * Element-specific exceptions. `why` is reported when an entry stops matching,
 * so stale entries get cleaned up instead of silently widening the rule.
 */
const allowlist = [
  {
    file: "shared/styles/layout/layout.styles.ts",
    match: /^nav: [`"]fixed bottom-0/,
    why: "MobileTabBar applies its bottom inset inline so the bar can measure its own height.",
  },
  {
    file: "shared/styles/dialogs/dialogComponents.styles.ts",
    match: /bottom-0 left-\[env\(safe-area-inset-left/,
    why: "BottomSheetView applies its bottom inset inline on the sheet element.",
  },
  {
    file: "shared/components/ui/toast.tsx",
    match: /^"fixed bottom-0 right-0 z-\[100\]/,
    why: "Radix viewport base; toastStackStyles.viewport overrides it with the inset-aware offsets.",
  },
];

function* codeFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* codeFiles(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield full;
  }
}

const isCommentLine = (line) => /^\s*(\/\/|\/\*|\*)/.test(line);
const usedAllowlist = new Set();
const violations = [];

for (const file of codeFiles(srcDir)) {
  if (skippedPathParts.some((part) => file.includes(part))) continue;

  const relative = path.relative(root, file);
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const checkAbsolute = hasOverlayWrapper(lines);

  lines.forEach((line) => {
    if (isCommentLine(line)) return;

    // Rail offsets have a single home; anywhere else is a stale copy.
    if (!relative.endsWith(RAIL_OFFSETS_SOURCE)) {
      const duplicated = railOffsetPatterns.find((pattern) =>
        pattern.test(line),
      );
      if (duplicated) {
        violations.push({
          relative,
          missing: [],
          line: line.trim().slice(0, 120),
          reason: `rail offset hardcoded — import it from ${RAIL_OFFSETS_SOURCE}`,
        });
        return;
      }
    }

    if (!POSITIONED.test(line)) return;
    if (skippedLinePatterns.some((pattern) => pattern.test(line))) return;

    const isSticky = /(^|[\s"'`])sticky(\s|$)/.test(line);
    const isAbsoluteOnly =
      !/(^|[\s"'`])fixed(\s|$)/.test(line) &&
      !isSticky &&
      /(^|[\s"'`])absolute(\s|$)/.test(line);
    if (isAbsoluteOnly && !checkAbsolute) return;

    const missing = EDGES.filter(({ edge, inset }) => {
      if (isSticky && !STICKY_AXES.has(inset)) return false;
      return edge.test(line) && !line.includes(inset);
    }).map(({ inset }) => inset);
    if (missing.length === 0) return;

    const allowlisted = allowlist.find(
      (entry) => relative.endsWith(entry.file) && entry.match.test(line.trim()),
    );
    if (allowlisted) {
      usedAllowlist.add(allowlisted.file);
      return;
    }

    violations.push({ relative, missing, line: line.trim().slice(0, 120) });
  });
}

if (violations.length > 0) {
  console.error(
    "Mobile-viewport problems — each one puts content under a system bar or lets rail offsets drift:\n",
  );
  for (const violation of violations) {
    console.error(`  ${violation.relative}`);
    console.error(
      `    ${violation.reason ?? `missing: ${violation.missing.join(", ")}`}`,
    );
    console.error(`    ${violation.line}`);
  }
  process.exit(1);
}

const unusedAllowlist = allowlist.filter(
  (entry) => !usedAllowlist.has(entry.file),
);
if (unusedAllowlist.length > 0) {
  console.error("Stale safe-area allowlist entries (remove or re-justify):\n");
  for (const entry of unusedAllowlist) {
    console.error(`  ${entry.file}: ${entry.why}`);
  }
  process.exit(1);
}

console.log("Safe-area offsets present on every viewport-edge element.");
