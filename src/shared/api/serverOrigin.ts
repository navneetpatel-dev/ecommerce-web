/**
 * Origin for server-side API fetches (RSC / generateMetadata).
 * When NEXT_PUBLIC_API_URL is empty, the browser uses same-origin `/api` via Next rewrites;
 * SSR must hit the Next origin so those rewrites apply (not a stale localhost:3000 default).
 */
export function getServerApiOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, '')
}
