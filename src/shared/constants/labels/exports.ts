export const exportsLabels = {
  exportQueued: "Export queued…",
  /** Interpolate with `formatExportProcessing` — LABELS values must stay strings. */
  exportProcessing: "Exporting… {percent}%",
  exportProcessingUnknown: "Exporting…",
  exportCompleted: "Export ready",
  exportFailed: "Export failed",
  exportCancelled: "Export cancelled",
  /** Creation-time failure — deliberately distinct from `exportFailed`, which implies the job started and then failed. */
  exportStartFailed: "Couldn't start the export — please try again",
  /** The export itself succeeded; only fetching/triggering the actual save failed. */
  exportDownloadLinkFailed:
    "Export finished, but the download link failed to load",
  exportCancelTooLate: "Too late to cancel — this export already started",
  exportCancelAction: "Cancel",
  exportDownloadAction: "Download",
  exportDismissAction: "Dismiss",
  exportTrayTitle: "Exports",
  /**
   * Currently unreachable by design, not dead code to delete: the tray
   * (Step 20) returns `null` outright when there are zero tracked jobs
   * rather than rendering an empty-state panel, so there's nowhere for
   * this to appear yet. Keep it defined — it's exactly what a future
   * persistent "export history" panel (mentioned as a possible extension
   * in Step 24) would need on day one.
   */
  exportTrayEmpty: "No exports yet",
} as const;

/** LABELS is a string map app-wide; percent interpolation lives here instead of as a function value. */
export function formatExportProcessing(percent: number): string {
  return exportsLabels.exportProcessing.replace("{percent}", String(percent));
}
