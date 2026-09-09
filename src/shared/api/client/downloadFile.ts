import { getApiSessionAdapter } from "@/shared/api/client/sessionAdapter";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { BEARER_PREFIX } from "@/shared/constants/http/http";
import { EXPORT_DOWNLOAD_TIMEOUT_MS } from "@/shared/constants/timing/timing";
import { ApiError } from "@/shared/types/apiError.types";
import { apiErrorFromFailureBody } from "@/shared/utils/api-errors/apiErrorMessage";
import { resolveDownloadFilename } from "@/shared/utils/files/downloadFilename";

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Downloads a binary file (PDF/xlsx/csv) behind bearer auth and triggers a
 * browser save. On failure, throws the server's real error message (via
 * apiErrorFromFailureBody) instead of a generic string.
 */
export async function downloadFile(
  path: string,
  fallbackName: string,
  timeoutMs: number = EXPORT_DOWNLOAD_TIMEOUT_MS,
): Promise<void> {
  const token = getApiSessionAdapter().getAccessToken();
  const res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
    credentials: "include",
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  });
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* non-JSON error body */
    }
    const err = apiErrorFromFailureBody(body, res.status);
    (err as ApiError & { status?: number }).status = res.status;
    throw err;
  }
  const blob = await res.blob();
  triggerBlobDownload(blob, resolveDownloadFilename(res, fallbackName));
}
