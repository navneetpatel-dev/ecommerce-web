/**
 * Liveness probe for the load balancer and container health checks.
 *
 * Deliberately zero I/O: it must not call the backend, so a backend outage
 * does not make the load balancer pull every healthy web task. Lives outside
 * `/api/*`, which is rewritten to the backend.
 */
export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json(
    { status: "ok", timestamp: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
