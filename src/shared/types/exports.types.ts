export type ExportJobStatus =
  "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type ExportFileFormat = "csv" | "xlsx" | "pdf";

export type ExportJobSummary = {
  jobId: string;
  status: ExportJobStatus;
  progressPercent: number;
  rowsProcessed: number;
  totalRowsEstimate: number | null;
  filename: string | null;
  errorMessage: string | null;
};

export type ExportJobListItem = {
  id: string;
  domain: string;
  exportType: string;
  format: ExportFileFormat;
  status: ExportJobStatus;
  progressPercent: number;
  filename: string | null;
  errorMessage: string | null;
  /** Null = finished but nobody has downloaded or dismissed it yet — see Step 17's reload-recovery note. */
  acknowledgedAt: string | null;
  createdAt: string;
};

export type StartExportInput = {
  domain: string;
  exportType: string;
  format: ExportFileFormat;
  filters: Record<string, unknown>;
};
