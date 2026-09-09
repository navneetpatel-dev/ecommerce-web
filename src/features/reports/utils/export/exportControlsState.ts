import type { ExportFileFormat } from "../../hooks/table/useReportHubHelpers/index";

export type ReportExportControlsState = {
  exportingFormat: ExportFileFormat | null;
  controlsDisabled: boolean;
};

export function deriveExportControlsState(
  exportingFormat: ExportFileFormat | null,
): ReportExportControlsState {
  return {
    exportingFormat,
    controlsDisabled: exportingFormat !== null,
  };
}
