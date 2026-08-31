import { apiClient } from "@/shared/api/client";
import type { AsyncExportResponse } from "@/features/reports/api/reportsEngine.api";

export {
  normalizeExportFormat,
  parseFormatFromExportPath,
} from "@/features/reports/hooks/useReportHubHelpers/index";
export type { ExportFileFormat } from "@/features/reports/hooks/useReportHubHelpers/index";

/** Initiate async export via JSON API — returns payload for followAsyncExport. */
export async function initiateAsyncExport(
  path: string,
): Promise<AsyncExportResponse> {
  const payload = await apiClient.get<Omit<AsyncExportResponse, "async">>(path);
  return { ...payload, async: true };
}
