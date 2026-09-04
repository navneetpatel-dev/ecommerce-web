/**
 * App/environment configuration (Rule 8/18/21): the single place that reads
 * public env vars for runtime behavior. Components and features import these
 * named values instead of touching `process.env` directly.
 *
 * Only non-secret, public values may live here — secrets never enter the
 * client bundle via NEXT_PUBLIC_*.
 */

/** Public site origin (used for SEO metadata, sitemap, robots). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5173"
).replace(/\/$/, "");

/**
 * Base URL prepended to API paths by the browser API client. When empty the
 * browser calls same-origin `/api/*`, which Next rewrites to the backend.
 */
export const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Socket.IO connects directly to the backend origin — WebSocket upgrades
 * aren't proxied through the Next.js `/api/*` rewrite the same way plain HTTP
 * is, so this always resolves to a real origin (never empty like
 * `CLIENT_API_BASE_URL` is in dev).
 */
export const SOCKET_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

/** Builds the redirect entry point for an OAuth provider flow. */
export function oauthEntryPoint(
  provider: string,
  redirect?: string | null,
): string {
  const base = `${CLIENT_API_BASE_URL}/api/auth/${provider}`;
  if (!redirect?.startsWith("/")) return base;
  return `${base}?redirect=${encodeURIComponent(redirect)}`;
}
