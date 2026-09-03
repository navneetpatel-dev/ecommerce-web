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
