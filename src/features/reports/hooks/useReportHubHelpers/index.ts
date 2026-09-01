import { LABELS } from "@/shared/constants/labels";
import {
  EXPORT_POLL_INITIAL_MS,
  EXPORT_POLL_MAX_DURATION_MS,
  EXPORT_POLL_MAX_MS,
  EXPORT_POLL_REQUEST_TIMEOUT_MS,
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

function pollRequestSignal(parent?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(EXPORT_POLL_REQUEST_TIMEOUT_MS);
  if (!parent) return timeout;
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([parent, timeout]);
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (parent.aborted) {
    controller.abort();
    return controller.signal;
  }
  parent.addEventListener("abort", abort, { once: true });
  timeout.addEventListener("abort", abort, { once: true });
  return controller.signal;
}

function filterDatePart(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  return iso.slice(0, 10);
}

function isExportNotReadyError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const status = (err as Error & { status?: number }).status;
  if (status === 422) return true;
  // Internal status detection — not shown to users.
   
  const message = err.message.toLowerCase();
  return message.includes("not ready") || message.includes("not ready yet");
}

async function downloadFromStatus(
  exportId: string,
  status: ExportStatusResult,
  formatHint: ExportFileFormat,
  options?: { signal?: AbortSignal },
) {
  const format = normalizeExportFormat(status.format ?? formatHint);
  const maxAttempts = 6;
  let latestStatus = status;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      await reportsEngineApi.downloadExport(
        exportId,
        latestStatus.reportType,
        filterDatePart(latestStatus.filterFrom),
        filterDatePart(latestStatus.filterTo),
        format,
        latestStatus.downloadUrl,
      );
      return;
    } catch (err) {
      const canRetry = isExportNotReadyError(err) && attempt < maxAttempts - 1;
      if (!canRetry) throw err;
      try {
        await sleep(Math.min(1_000 * (attempt + 1), 4_000), options?.signal);
      } catch {
        throw err;
      }
      const refreshed = await reportsEngineApi.exportStatus(
        exportId,
        undefined,
        options?.signal,
      );
      if ("notModified" in refreshed) continue;
      latestStatus = refreshed;
      if (refreshed.status === "FAILED") {
        throw new Error(
          refreshed.errorMessage?.trim() || LABELS.reportAsyncFailed,
        );
      }
      if (refreshed.status !== "READY" && refreshed.status !== "SYNC") continue;
    }
  }
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

    const status = await reportsEngineApi.exportStatus(
      exportId,
      etag,
      pollRequestSignal(options?.signal),
    );
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
      await downloadFromStatus(exportId, status, format, options);
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
      pollRequestSignal(options?.signal),
    );
    if ("notModified" in status) {
      return pollExportUntilReady(response.exportId, format, options);
    }
    await downloadFromStatus(response.exportId, status, format, options);
    return { outcome: "ready" };
  }
  return pollExportUntilReady(response.exportId, format, options);
}
