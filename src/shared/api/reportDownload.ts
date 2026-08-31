import { getApiSessionAdapter } from "@/shared/api/sessionAdapter";
import { apiClient } from "@/shared/api/client";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { EXPORT_DOWNLOAD_TIMEOUT_MS } from "@/shared/constants/timing";
import { LABELS } from "@/shared/constants/labels";
import { resolveDownloadFilename } from "@/shared/utils/downloadFilename";
import {
  normalizeExportFormat,
  parseFormatFromExportPath,
  pollAsyncExportResponse,
  type ExportFileFormat,
} from "@/features/reports/hooks/useReportHubHelpers/index";

export type { ExportFileFormat };
export {
  normalizeExportFormat,
  parseFormatFromExportPath,
} from "@/features/reports/hooks/useReportHubHelpers/index";

/**
 * Authenticated blob download of a report export (network I/O — api layer,
 * Rule 1/12). Resolves the access token via the session adapter; never
 * touches storage directly.
 */
export async function downloadReport(
  path: string,
  fallbackFilename: string,
): Promise<void> {
  const token = getApiSessionAdapter().getAccessToken();
  const res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
    credentials: "include",
    signal: AbortSignal.timeout(EXPORT_DOWNLOAD_TIMEOUT_MS),
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  });
  if (!res.ok) throw new Error(LABELS.couldNotLoadReport);

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await res.json()) as {
      data?: {
        async?: boolean;
        exportId?: string;
        status?: string;
        reportType?: string;
        format?: string;
      };
    };
    const payload = body.data;
    if (payload?.async && payload.exportId) {
      await pollAsyncExportResponse({
        exportId: payload.exportId,
        status: payload.status,
        reportType: payload.reportType,
        format: payload.format ?? parseFormatFromExportPath(path),
      });
      return;
    }
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = resolveDownloadFilename(res, fallbackFilename);
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Initiate async export via JSON API (legacy panels). Throws on poll failed/timeout. */
export async function initiateAsyncExport(
  path: string,
  formatHint?: ExportFileFormat,
): Promise<void> {
  const payload = await apiClient.get<{
    exportId: string;
    status: string;
    format?: string;
  }>(path);
  await pollAsyncExportResponse({
    ...payload,
    format: payload.format ?? formatHint ?? parseFormatFromExportPath(path),
  });
}
