import { LABELS } from "@/shared/constants/labels";
import {
  EXPORT_POLL_INITIAL_MS,
  EXPORT_POLL_MAX_DURATION_MS,
  EXPORT_POLL_MAX_MS,
} from "@/shared/constants/timing";
import {
  reportsEngineApi,
  type ExportStatusResult,
} from "../../api/reportsEngine.api";
import { assertPollOutcome } from "../../utils/reportExportPollError";

export type ExportFileFormat = "csv" | "pdf" | "xlsx";

export function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function labelForKey(key: string): string {
  const map = LABELS as Record<string, string>;
  return map[key] ?? key;
}

export function normalizeExportFormat(value: unknown): ExportFileFormat {
  if (value === "csv" || value === "pdf" || value === "xlsx") return value;
  return "xlsx";
}

export function parseFormatFromExportPath(path: string): ExportFileFormat {
  try {
    const url = new URL(path, "http://local");
    return normalizeExportFormat(url.searchParams.get("format"));
  } catch {
    const match = path.match(/[?&]format=(csv|pdf|xlsx)/i);
    return normalizeExportFormat(match?.[1]?.toLowerCase());
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterDatePart(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  return iso.slice(0, 10);
}

async function downloadFromStatus(
  exportId: string,
  status: ExportStatusResult,
  formatHint: ExportFileFormat,
) {
  const format = normalizeExportFormat(status.format ?? formatHint);
  await reportsEngineApi.downloadExport(
    exportId,
    status.reportType,
    filterDatePart(status.filterFrom),
    filterDatePart(status.filterTo),
    format,
    status.downloadUrl,
  );
}

export async function pollExportUntilReady(
  exportId: string,
  formatHint: ExportFileFormat = "xlsx",
): Promise<ExportPollOutcome> {
  const started = Date.now();
  let interval = EXPORT_POLL_INITIAL_MS;
  let etag: string | undefined;

  while (Date.now() - started < EXPORT_POLL_MAX_DURATION_MS) {
    const status = await reportsEngineApi.exportStatus(exportId, etag);
    if ("notModified" in status) {
      etag = status.etag;
      await sleep(interval);
      interval = Math.min(interval * 2, EXPORT_POLL_MAX_MS);
      continue;
    }
    etag = status.etag;
    const format = normalizeExportFormat(status.format ?? formatHint);
    if (status.status === "READY" || status.status === "SYNC") {
      await downloadFromStatus(exportId, status, format);
      return "ready";
    }
    if (status.status === "FAILED") {
      return "failed";
    }
    if (status.status === "PROCESSING" && !status.rowCountKnown) {
      // streaming export — keep polling until row count is known or READY
    }
    await sleep(interval);
    interval = Math.min(interval * 2, EXPORT_POLL_MAX_MS);
  }
  return "timeout";
}

export type ExportPollOutcome = "ready" | "failed" | "pending" | "timeout";

export function applyPollOutcome(
  outcome: ExportPollOutcome,
  handlers: {
    setMessage: (message: string | null) => void;
    setError: (error: string | null) => void;
  },
) {
  if (outcome === "ready") {
    handlers.setMessage(LABELS.reportAsyncReady);
    handlers.setError(null);
    return;
  }
  if (outcome === "failed") {
    handlers.setError(LABELS.reportAsyncFailed);
    handlers.setMessage(null);
    return;
  }
  if (outcome === "timeout") {
    handlers.setMessage(LABELS.reportAsyncTimeout);
    handlers.setError(null);
    return;
  }
  handlers.setMessage(LABELS.reportAsyncQueued);
  handlers.setError(null);
}

/** Poll and download for legacy panel exports returning async JSON. Throws on failed/timeout. */
export async function pollAsyncExportResponse(response: {
  exportId: string;
  status?: string;
  reportType?: string;
  format?: string;
}): Promise<void> {
  const format = normalizeExportFormat(response.format);
  if (response.status === "READY") {
    const status = await reportsEngineApi.exportStatus(response.exportId);
    if ("notModified" in status) {
      assertPollOutcome(await pollExportUntilReady(response.exportId, format));
      return;
    }
    await downloadFromStatus(response.exportId, status, format);
    return;
  }
  assertPollOutcome(await pollExportUntilReady(response.exportId, format));
}
