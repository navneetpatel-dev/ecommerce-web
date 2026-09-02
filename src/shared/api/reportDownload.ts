import { apiClient } from "@/shared/api/client";
import type { AsyncExportResponse } from "@/features/reports/api/reportsEngine.api";
import { API_TIMEOUT_MS } from "@/shared/constants/timing";

export {
  normalizeExportFormat,
  parseFormatFromExportPath,
} from "@/features/reports/hooks/useReportHubHelpers/index";
export type { ExportFileFormat } from "@/features/reports/hooks/useReportHubHelpers/index";

/** Initiate async export via JSON API — returns payload for followAsyncExport. */
export async function initiateAsyncExport(
  path: string,
  options?: { timeoutMs?: number },
): Promise<AsyncExportResponse> {
  const payload = await apiClient.get<Omit<AsyncExportResponse, "async">>(path, {
    timeoutMs: options?.timeoutMs ?? API_TIMEOUT_MS,
  });
  return { ...payload, async: true };
}
