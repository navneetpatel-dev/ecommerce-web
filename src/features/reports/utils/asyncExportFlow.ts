import type { AsyncExportResponse } from "../api/reportsEngine.api";
import {
  applyPollOutcome,
  normalizeExportFormat,
  pollAsyncExportResponse,
  pollExportUntilReady,
  type ExportFileFormat,
} from "../hooks/useReportHubHelpers/index";
import type { PollExportResult } from "./reportExportPollError";
import { initialExportStatusMessage, terminalExportStatusMessage } from "./exportStatusMessage";

export type AsyncExportHandlers = {
  setMessage: (message: string | null) => void;
  setError: (error: string | null) => void;
};

export function initialAsyncExportMessage(
  response: Pick<
    AsyncExportResponse,
    "cached" | "deduped" | "status" | "format" | "rowCount" | "rowCountKnown"
  >,
  formatHint: ExportFileFormat = "xlsx",
): string {
  const emptyRange =
    response.rowCountKnown === true && (response.rowCount ?? 0) === 0;
  return initialExportStatusMessage(response, formatHint, { emptyRange });
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
  handlers.setMessage(initialAsyncExportMessage(response, format));
  handlers.setError(null);

  const pollContext = {
    cached: response.cached,
    deduped: response.deduped,
    emptyRange:
      response.rowCountKnown === true && (response.rowCount ?? 0) === 0,
  };

  const pollOptions = {
    ...options,
    formatHint: format,
    pollContext,
    onProgress: (message: string) => handlers.setMessage(message),
  };

  if (response.status === "READY") {
    if (options?.downloadReady) {
      await options.downloadReady(response.exportId, format);
      const terminal = terminalExportStatusMessage("ready");
      handlers.setMessage(terminal.message);
      handlers.setError(terminal.error);
      return { outcome: "ready" };
    }
    const result = await pollAsyncExportResponse(response, pollOptions);
    applyPollOutcome(result, handlers);
    return result;
  }

  const result = await pollExportUntilReady(response.exportId, format, pollOptions);
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
