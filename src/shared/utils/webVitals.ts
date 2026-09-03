import { API } from "@/shared/constants/apiRoutes";

/** Minimal shape of a web-vitals metric entry (mirrors the `web-vitals` lib). */
interface VitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  id: string;
}

/**
 * Sends a Web Vitals metric to the reporting endpoint. Uses sendBeacon when
 * available so reports survive page unload; falls back to keepalive fetch.
 * The endpoint is unauthenticated and persisted server-side by the backend
 * (not this app) — same-origin `/api/*` is proxied there by next.config.mjs.
 */
export function sendBeacon(metric: VitalMetric): void {
  const connection = (
    navigator as Navigator & { connection?: { effectiveType?: string } }
  ).connection;

  const payload = JSON.stringify({
    name: metric.name,
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value,
    ),
    rating: metric.rating,
    path: window.location.pathname,
    effectiveType: connection?.effectiveType ?? null,
  });

  if (typeof navigator.sendBeacon === "function") {
    // A raw string defaults to a `text/plain` beacon, which the backend's
    // JSON body parser won't parse — a Blob lets us set the real content type.
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(API.webVitals.record, blob);
    return;
  }
  void fetch(API.webVitals.record, {
    method: "POST",
    body: payload,
    keepalive: true,
    headers: { "Content-Type": "application/json" },
  });
}
