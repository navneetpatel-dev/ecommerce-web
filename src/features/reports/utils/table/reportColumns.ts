import { LABELS } from "@/shared/constants/labels";
import type { ReportColumnMeta } from "../../api/table/reportsEngine.api";

/** The server's display name first (the one exports use), then the app's labels, then the key. */
export function reportColumnHeader(column: ReportColumnMeta): string {
  const labels = LABELS as Record<string, string>;
  return column.label || labels[column.labelKey] || column.labelKey;
}

/**
 * Columns worth showing on screen: a raw vendor ID next to the vendor's name only adds a
 * cut-off UUID, so it's left to the export.
 */
export function visibleReportColumns(
  columns: ReportColumnMeta[],
): ReportColumnMeta[] {
  const hasVendorName = columns.some((column) => column.key === "vendorName");
  return hasVendorName
    ? columns.filter((column) => column.key !== "vendorId")
    : columns;
}
