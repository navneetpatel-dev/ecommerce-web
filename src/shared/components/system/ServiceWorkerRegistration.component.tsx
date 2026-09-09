"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Dev uses stable Turbopack chunk URLs. A leftover SW serving those from
    // cache after file moves produces "module factory is not available".
    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(
          registrations.map((registration) => registration.unregister()),
        ),
      );
      void caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("delivery-app-shell-"))
            .map((key) => caches.delete(key)),
        ),
      );
      return;
    }

    void navigator.serviceWorker.register("/sw.js").catch(() => {
      // Push remains optional when service-worker registration is unavailable.
    });
  }, []);

  return null;
}
