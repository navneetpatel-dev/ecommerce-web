import { CLIENT_API_BASE_URL, SITE_URL } from "@/shared/config/appConfig";

/**
 * Origin for server-side API fetches (RSC / generateMetadata).
 * When NEXT_PUBLIC_API_URL is empty, the browser uses same-origin `/api` via Next rewrites;
 * SSR must hit the Next origin so those rewrites apply (not a stale localhost default).
 */
export function getServerApiOrigin(): string {
  const configured = CLIENT_API_BASE_URL.trim();
  if (configured) return configured.replace(/\/$/, "");
  return SITE_URL;
}
