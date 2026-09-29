import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

/**
 * Runs public/sw.js in a fake service-worker scope. The offline fallback is a
 * user-visible dead-end if it regresses, and it cannot be exercised by hand
 * without a real phone in a tunnel, so its routing is pinned here.
 */
const SHELL_CACHE = "delivery-app-shell-v3";
const OFFLINE_URL = "/offline";
const DELIVERY_ROUTES = [
  "/delivery/dashboard/today",
  "/delivery/dashboard/deliveries",
  "/delivery/dashboard/pickups",
  "/delivery/dashboard/history",
  "/delivery/dashboard/profile",
];

const ORIGIN = "https://shop.test";

type Handler = (event: Record<string, unknown>) => void;

function createServiceWorker(network: () => Promise<unknown>) {
  const handlers = new Map<string, Handler[]>();
  const stores = new Map<string, Map<string, unknown>>();
  // The real Cache API resolves `cache.addAll(["/offline"])` against the
  // worker's scope, so requests and precached entries share one key space.
  const keyOf = (request: unknown) =>
    new URL(
      typeof request === "string"
        ? request
        : String((request as { url: string }).url),
      ORIGIN,
    ).pathname;

  const pages = () => {
    if (!stores.has(SHELL_CACHE)) stores.set(SHELL_CACHE, new Map());
    return stores.get(SHELL_CACHE)!;
  };

  const cache = {
    addAll: async (urls: string[]) => {
      for (const url of urls) pages().set(keyOf(url), { url });
    },
    put: async (request: unknown, response: unknown) => {
      pages().set(keyOf(request), response);
    },
    match: async (request: unknown) => pages().get(keyOf(request)),
  };

  const caches = {
    open: async () => cache,
    keys: async () => [...stores.keys()],
    delete: async (name: string) => stores.delete(name),
    match: async (request: unknown) => pages().get(keyOf(request)),
  };

  const self = {
    location: { origin: ORIGIN },
    addEventListener: (type: string, handler: Handler) => {
      handlers.set(type, [...(handlers.get(type) ?? []), handler]);
    },
    skipWaiting: () => undefined,
    clients: { claim: async () => undefined, matchAll: async () => [] },
    registration: { showNotification: async () => undefined },
  };

  vm.runInNewContext(
    fs.readFileSync(path.resolve(process.cwd(), "public/sw.js"), "utf8"),
    { self, caches, fetch: network, URL, console },
  );

  /** Fires a lifecycle event and collects everything it asked to `waitUntil`. */
  const fire = (type: string, event: Record<string, unknown> = {}) => {
    const waited: Promise<unknown>[] = [];
    const withWait = {
      ...event,
      waitUntil: (promise: Promise<unknown>) => waited.push(promise),
    };
    for (const handler of handlers.get(type) ?? []) handler(withWait);
    return waited;
  };

  return { fire, stores, cachedPages: () => [...pages().keys()] };
}

const offlineNetwork = async () => {
  throw new Error("offline");
};

const navigation = (pathname: string) => {
  let response: Promise<unknown> | undefined;
  return {
    event: {
      request: { method: "GET", url: `${ORIGIN}${pathname}`, mode: "navigate" },
      respondWith: (promise: Promise<unknown>) => {
        response = promise;
      },
    },
    settled: () => response,
    responded: () => response !== undefined,
  };
};

describe("service worker offline shell", () => {
  it("precaches the delivery shell and the offline page on install", async () => {
    const sw = createServiceWorker(offlineNetwork);

    await Promise.all(sw.fire("install"));

    expect(sw.cachedPages()).toEqual(
      expect.arrayContaining([...DELIVERY_ROUTES, OFFLINE_URL]),
    );
  });

  it("drops caches from earlier shells on activate", async () => {
    const sw = createServiceWorker(offlineNetwork);
    await Promise.all(sw.fire("install"));
    sw.stores.set("delivery-app-shell-v2", new Map());

    await Promise.all(sw.fire("activate"));

    expect([...sw.stores.keys()]).toEqual([SHELL_CACHE]);
  });

  it("serves the offline page when a storefront navigation fails", async () => {
    const sw = createServiceWorker(offlineNetwork);
    await Promise.all(sw.fire("install"));

    const { event, settled, responded } = navigation("/products/brass-lamp");
    sw.fire("fetch", event);

    expect(responded()).toBe(true);
    // A per-customer page is never cached, so the fallback is the static page
    // rather than a stale cart or price.
    expect(await settled()).toMatchObject({ url: OFFLINE_URL });
  });

  it("serves the precached delivery page instead for shell routes", async () => {
    const sw = createServiceWorker(offlineNetwork);
    await Promise.all(sw.fire("install"));

    const { event, settled } = navigation("/delivery/dashboard/today");
    sw.fire("fetch", event);

    expect(await settled()).toMatchObject({
      url: "/delivery/dashboard/today",
    });
  });

  it("falls back to the cached chunk for build assets when offline", async () => {
    const chunk = `${ORIGIN}/_next/static/chunks/app.js`;
    const cachedChunk = { ok: true, from: "cache" };
    let calls = 0;
    // Chunks are network-first so a deploy is never blocked by a stale file:
    // the cache only answers once the network has actually failed.
    const flaky = async () => {
      calls += 1;
      if (calls === 1)
        return { clone: () => cachedChunk, ok: true, from: "network" };
      throw new Error("offline");
    };
    const sw = createServiceWorker(flaky);
    const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

    sw.fire("fetch", {
      request: { method: "GET", url: chunk },
      respondWith: () => undefined,
    });
    await flush();

    const second = {
      request: { method: "GET", url: chunk },
      respondWith: (promise: Promise<unknown>) => {
        second.response = promise;
      },
      response: undefined as Promise<unknown> | undefined,
    };
    sw.fire("fetch", second);

    expect(await second.response).toMatchObject(cachedChunk);
  });

  it("ignores cross-origin requests and non-GET methods", async () => {
    const sw = createServiceWorker(offlineNetwork);

    const crossOrigin = navigation("/x");
    crossOrigin.event.request.url = "https://other.test/x";
    sw.fire("fetch", crossOrigin.event);
    expect(crossOrigin.responded()).toBe(false);

    const post = navigation("/cart");
    post.event.request.method = "POST";
    sw.fire("fetch", post.event);
    expect(post.responded()).toBe(false);
  });
});
