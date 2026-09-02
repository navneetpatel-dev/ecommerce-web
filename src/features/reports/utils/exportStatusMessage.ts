import { LABELS } from "@/shared/constants/labels";
import type { ExportStatus } from "../api/reportsEngine.api";

export type ExportFileFormat = "csv" | "pdf" | "xlsx";

export type ExportStatusMessageContext = {
  status?: ExportStatus;
  format?: ExportFileFormat;
  elapsedMs?: number;
  cached?: boolean;
  deduped?: boolean;
  emptyRange?: boolean;
};

function formatLabel(template: string, seconds: number): string {
  return template.replace("{seconds}", String(seconds));
}

function generatingLabel(format: ExportFileFormat | undefined): string {
  if (format === "pdf") return LABELS.reportAsyncGeneratingPdf;
  if (format === "csv") return LABELS.reportAsyncGeneratingCsv;
  return LABELS.reportAsyncGeneratingXlsx;
}

export function exportStatusMessage(ctx: ExportStatusMessageContext): string {
  const elapsedMs = ctx.elapsedMs ?? 0;
  const seconds = Math.max(1, Math.floor(elapsedMs / 1000));

  if (ctx.cached) return LABELS.reportAsyncCached;
  if (ctx.deduped && ctx.status !== "PROCESSING") {
    return seconds > 10
      ? formatLabel(LABELS.reportAsyncResumingSeconds, seconds)
      : LABELS.reportAsyncResuming;
  }
  if (ctx.emptyRange) return LABELS.reportAsyncEmptyRange;

  const status = ctx.status ?? "PENDING";
  if (status === "READY" || status === "SYNC") return LABELS.reportAsyncReady;
  if (status === "PROCESSING") {
    return seconds > 20
      ? formatLabel(LABELS.reportAsyncGeneratingSeconds, seconds)
      : generatingLabel(ctx.format);
  }

  if (seconds > 20) {
    return formatLabel(LABELS.reportAsyncWaitingSeconds, seconds);
  }
  if (seconds > 8) {
    return LABELS.reportAsyncWaiting;
  }
  return LABELS.reportAsyncPreparing;
}

export function initialExportStatusMessage(
  response: {
    cached?: boolean;
    deduped?: boolean;
    status?: ExportStatus;
    format?: string;
  },
  formatHint: ExportFileFormat,
  options?: { emptyRange?: boolean },
): string {
  return exportStatusMessage({
    status: response.status,
    format: normalizeFormatHint(response.format, formatHint),
    cached: response.cached,
    deduped: response.deduped,
    emptyRange: options?.emptyRange,
  });
}

function normalizeFormatHint(
  value: string | undefined,
  fallback: ExportFileFormat,
): ExportFileFormat {
  if (value === "csv" || value === "pdf" || value === "xlsx") return value;
  return fallback;
}
