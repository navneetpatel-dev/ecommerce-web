import { LABELS } from "@/shared/constants/labels";
import {
  EXPORT_POLL_INITIAL_MS,
  EXPORT_POLL_MAX_DURATION_MS,
  EXPORT_POLL_MAX_MS,
} from "@/shared/constants/timing";
import {
  reportsEngineApi,
  type ExportStatus,
  type ExportStatusResult,
} from "../../api/reportsEngine.api";
import type { PollExportResult } from "../../utils/reportExportPollError";

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

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
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

export type ExportPollOutcome = "ready" | "failed" | "timeout" | "aborted";

export async function pollExportUntilReady(
  exportId: string,
  formatHint: ExportFileFormat = "xlsx",
  options?: { signal?: AbortSignal },
): Promise<PollExportResult> {
  const started = Date.now();
  let interval = EXPORT_POLL_INITIAL_MS;
  let etag: string | undefined;

  while (Date.now() - started < EXPORT_POLL_MAX_DURATION_MS) {
    if (options?.signal?.aborted) {
      return { outcome: "aborted" };
    }

    const status = await reportsEngineApi.exportStatus(exportId, etag, options?.signal);
    if ("notModified" in status) {
      etag = status.etag;
      try {
        await sleep(interval, options?.signal);
      } catch {
        return { outcome: "aborted" };
      }
      interval = Math.min(interval * 2, EXPORT_POLL_MAX_MS);
      continue;
    }
    etag = status.etag;
    const format = normalizeExportFormat(status.format ?? formatHint);
    if (status.status === "READY" || status.status === "SYNC") {
      await downloadFromStatus(exportId, status, format);
      return { outcome: "ready" };
    }
    if (status.status === "FAILED") {
      return { outcome: "failed", errorMessage: status.errorMessage };
    }
    try {
      await sleep(interval, options?.signal);
    } catch {
      return { outcome: "aborted" };
    }
    interval = Math.min(interval * 2, EXPORT_POLL_MAX_MS);
  }
  return { outcome: "timeout" };
}

export function applyPollOutcome(
  result: PollExportResult,
  handlers: {
    setMessage: (message: string | null) => void;
    setError: (error: string | null) => void;
  },
) {
  if (result.outcome === "ready") {
    handlers.setMessage(LABELS.reportAsyncReady);
    handlers.setError(null);
    return;
  }
  if (result.outcome === "failed") {
    handlers.setError(result.errorMessage?.trim() || LABELS.reportAsyncFailed);
    handlers.setMessage(null);
    return;
  }
  if (result.outcome === "timeout") {
    handlers.setMessage(LABELS.reportAsyncTimeout);
    handlers.setError(null);
    return;
  }
  if (result.outcome === "aborted") {
    handlers.setMessage(null);
    handlers.setError(null);
    return;
  }
  handlers.setMessage(LABELS.reportAsyncQueued);
  handlers.setError(null);
}

/** Poll and download for legacy panel exports — no throw on timeout/abort. */
export async function pollAsyncExportResponse(
  response: {
    exportId: string;
    status?: ExportStatus;
    reportType?: string;
    format?: string;
    deduped?: boolean;
    cached?: boolean;
  },
  options?: { signal?: AbortSignal },
): Promise<PollExportResult> {
  const format = normalizeExportFormat(response.format);
  if (response.status === "READY") {
    const status = await reportsEngineApi.exportStatus(
      response.exportId,
      undefined,
      options?.signal,
    );
    if ("notModified" in status) {
      return pollExportUntilReady(response.exportId, format, options);
    }
    await downloadFromStatus(response.exportId, status, format);
    return { outcome: "ready" };
  }
  return pollExportUntilReady(response.exportId, format, options);
}
