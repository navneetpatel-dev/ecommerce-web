// Offline fallback for the whole app (PWA support): precache a static offline
// page, and keep build assets available offline. Pages are deliberately NOT
// precached (prices, carts and orders are per-customer): a failed navigation
// lands on /offline instead of the browser's error screen.
const APP_SHELL_CACHE = "app-shell-v4";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL]))
      .catch(() => undefined),
  );
  self.skipWaiting();
});

// This worker owns the origin's Cache Storage: anything that is not the
// current cache is left over from an earlier version and is dropped.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== APP_SHELL_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Static build assets: network-first so a new deploy (or Turbopack rebuild)
  // is never blocked by a stale chunk. Cache is only used when offline.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(APP_SHELL_CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            void cache.put(request, response.clone());
            return response;
          })
          .catch(() => cache.match(request)),
      ),
    );
    return;
  }

  // Any other page navigation: always try the network (a cached per-customer
  // page would show stale prices, carts or orders), and only when it fails
  // fall back to the cached /offline page instead of the browser error screen.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
  }
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Ecommerce", body: event.data.text(), url: "/" };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || "Ecommerce", {
      body: payload.body || "You have a new update.",
      data: { url: payload.url || "/" },
      tag: payload.tag,
      renotify: Boolean(payload.tag),
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const requestedUrl = new URL(
    event.notification.data?.url || "/",
    self.location.origin,
  );
  const targetUrl =
    requestedUrl.origin === self.location.origin
      ? requestedUrl.href
      : self.location.origin;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((client) => client.url === targetUrl);
        if (existing) return existing.focus();
        return self.clients.openWindow(targetUrl);
      }),
  );
});
