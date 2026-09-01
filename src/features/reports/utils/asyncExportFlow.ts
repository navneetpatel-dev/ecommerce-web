import { LABELS } from "@/shared/constants/labels";
import type { AsyncExportResponse } from "../api/reportsEngine.api";
import {
  applyPollOutcome,
  normalizeExportFormat,
  pollAsyncExportResponse,
  pollExportUntilReady,
  type ExportFileFormat,
} from "../hooks/useReportHubHelpers/index";
import type { PollExportResult } from "./reportExportPollError";

export type AsyncExportHandlers = {
  setMessage: (message: string | null) => void;
  setError: (error: string | null) => void;
};

export function initialAsyncExportMessage(
  response: Pick<AsyncExportResponse, "cached" | "deduped" | "status">,
): string {
  if (response.cached) return LABELS.reportAsyncCached;
  if (response.deduped) return LABELS.reportAsyncDeduped;
  if (response.status === "READY") return LABELS.reportAsyncReady;
  return LABELS.reportAsyncQueued;
}

/** Poll (and download when ready) without throwing on timeout/abort. */
export async function followAsyncExport(
  response: AsyncExportResponse,
  formatHint: ExportFileFormat,
  handlers: AsyncExportHandlers,
  options?: {
    signal?: AbortSignal;
    downloadReady?: (
      exportId: string,
      format: ExportFileFormat,
    ) => Promise<void>;
  },
): Promise<PollExportResult> {
  const format = normalizeExportFormat(response.format ?? formatHint);
  handlers.setMessage(initialAsyncExportMessage(response));
  handlers.setError(null);

  if (response.status === "READY") {
    if (options?.downloadReady) {
      await options.downloadReady(response.exportId, format);
      handlers.setMessage(LABELS.reportAsyncReady);
      handlers.setError(null);
      return { outcome: "ready" };
    }
    const result = await pollAsyncExportResponse(response, options);
    applyPollOutcome(result, handlers);
    return result;
  }

  const result = await pollExportUntilReady(response.exportId, format, options);
  applyPollOutcome(result, handlers);
  return result;
}

export function isBenignExportError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return (
    err.name === "ReportExportPollError" ||
    err.name === "ReportExportLockedError" ||
    err.name === "AbortError" ||
    err.name === "TimeoutError" ||
    err.name === "DOMException"
  );
}
