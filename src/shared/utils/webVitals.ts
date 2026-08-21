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
    id: metric.id,
    path: window.location.pathname,
    effectiveType: connection?.effectiveType ?? null,
  });

  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon("/api/vitals", payload);
    return;
  }
  void fetch("/api/vitals", {
    method: "POST",
    body: payload,
    keepalive: true,
    headers: { "Content-Type": "application/json" },
  });
}
