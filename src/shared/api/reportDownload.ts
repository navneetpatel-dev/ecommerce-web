import { getApiSessionAdapter } from "@/shared/api/sessionAdapter";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { API_TIMEOUT_MS } from "@/shared/constants/timing";
import { LABELS } from "@/shared/constants/labels";

/**
 * Authenticated blob download of a report export (network I/O — api layer,
 * Rule 1/12). Resolves the access token via the session adapter; never
 * touches storage directly.
 */
export async function downloadReport(
  path: string,
  filename: string,
): Promise<void> {
  const token = getApiSessionAdapter().getAccessToken();
  const res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
    credentials: "include",
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  });
  if (!res.ok) throw new Error(LABELS.couldNotLoadReport);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
