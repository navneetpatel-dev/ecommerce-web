import { SERVER_API_ORIGIN } from "@/shared/config/appConfig";

/**
 * Origin for server-side API calls: the backend itself, never the public site
 * URL (which made every server-side category lookup fail when it was unset).
 */
export function getServerApiOrigin(): string {
  return SERVER_API_ORIGIN;
}
