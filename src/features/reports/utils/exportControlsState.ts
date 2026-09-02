import type { ExportFileFormat } from "../hooks/useReportHubHelpers/index";

export type ReportExportControlsState = {
  exportingFormat: ExportFileFormat | null;
  locked: boolean;
  controlsDisabled: boolean;
};

export function deriveExportControlsState(
  exportingFormat: ExportFileFormat | null,
  locked: boolean,
): ReportExportControlsState {
  return {
    exportingFormat,
    locked,
    controlsDisabled: exportingFormat !== null || locked,
  };
}
