import { LABELS } from "@/shared/constants/labels";
import type { ExportFileFormat } from "../hooks/useReportHubHelpers/index";

export type ExportDisableHintContext = {
  message?: string | null;
  exportingFormat?: ExportFileFormat | null;
  controlsDisabled?: boolean;
};

function liveStatusMessage(
  message: string | null | undefined,
  exportingFormat: ExportFileFormat | null | undefined,
): string | null {
  if (message?.trim()) return message.trim();
  if (exportingFormat) return LABELS.reportExportPreparing;
  return null;
}

/** Visible status line — never empty while an export is active. */
export function resolveExportStatusDisplay(
  ctx: ExportDisableHintContext,
): string | null {
  return liveStatusMessage(ctx.message, ctx.exportingFormat);
}

/** Tooltip for date/filter controls locked during export. */
export function exportFilterDisableHint(ctx: ExportDisableHintContext): string {
  if (!ctx.controlsDisabled) return "";
  const live = liveStatusMessage(ctx.message, ctx.exportingFormat);
  if (live) return live;
  return LABELS.reportExportFiltersLocked;
}

/** Tooltip for an export button locked while another export runs. */
export function exportButtonDisableHint(
  ctx: ExportDisableHintContext & {
    format: ExportFileFormat;
    blocked?: boolean;
    blockedHint?: string;
  },
): string {
  if (ctx.blocked && ctx.blockedHint) return ctx.blockedHint;
  if (!ctx.controlsDisabled && !ctx.blocked) return "";
  const live = liveStatusMessage(ctx.message, ctx.exportingFormat);
  if (live && ctx.exportingFormat === ctx.format) return live;
  if (ctx.exportingFormat && ctx.exportingFormat !== ctx.format) {
    return LABELS.reportExportOtherFormatLocked;
  }
  if (live) return live;
  return LABELS.reportExportButtonLocked;
}
