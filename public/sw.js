// App-shell caching for the delivery agent dashboard (offline PWA support):
// precache the shell routes on install, then serve navigations cache-first
// with a network refresh, so today's task list still opens with no signal.
const DELIVERY_CACHE = "delivery-app-shell-v2";
const DELIVERY_SHELL_PATHS = [
  "/delivery/dashboard/today",
  "/delivery/dashboard/deliveries",
  "/delivery/dashboard/pickups",
  "/delivery/dashboard/history",
  "/delivery/dashboard/profile",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(DELIVERY_CACHE)
      .then((cache) => cache.addAll(DELIVERY_SHELL_PATHS))
      .catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("delivery-app-shell-") && key !== DELIVERY_CACHE)
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

  // Delivery shell pages: network-first, falling back to the precached copy
  // offline (kept fresh on every successful online visit).
  if (DELIVERY_SHELL_PATHS.includes(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(DELIVERY_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // Static build assets: network-first so a new deploy (or Turbopack rebuild)
  // is never blocked by a stale chunk. Cache is only used when offline.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(DELIVERY_CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            void cache.put(request, response.clone());
            return response;
          })
          .catch(() => cache.match(request)),
      ),
    );
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag !== "delivery-status-sync") return;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
      clientsList.forEach((client) => client.postMessage({ type: "DELIVERY_FLUSH_QUEUE" }));
    }),
  );
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
