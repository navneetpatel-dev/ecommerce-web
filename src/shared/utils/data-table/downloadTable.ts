import type { DataTableColumn } from "../../types/data-table/types";
import { resolveCell } from "../../components/DataTable/utils.component";

export type ExportFormat = "csv" | "excel" | "json" | "tsv";

function extractCellText(content: unknown): string {
  if (content === null || content === undefined) return "";
  if (
    typeof content === "string" ||
    typeof content === "number" ||
    typeof content === "boolean"
  ) {
    return String(content);
  }
  return "";
}

function escapeCsvValue(val: string): string {
  const needsQuotes =
    val.includes(",") ||
    val.includes('"') ||
    val.includes("\n") ||
    val.includes("\r");
  if (needsQuotes) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Builds the chosen file from the rows' text cells and hands it to the browser. */
export function downloadTable<T>(
  format: ExportFormat,
  exportableColumns: DataTableColumn<T>[],
  targetRows: T[],
  filename: string,
) {
  const headers = exportableColumns.map((col) =>
    typeof col.header === "string" ? col.header : col.mobileLabel || col.id,
  );

  const rowsData = targetRows.map((row, rowIdx) =>
    exportableColumns.map((col) => {
      const raw = resolveCell(col, row, rowIdx);
      return extractCellText(raw);
    }),
  );

  const dateStr = new Date().toISOString().split("T")[0];
  const baseName = `${filename}-${dateStr}`;

  if (format === "json") {
    const jsonData = rowsData.map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });
    triggerDownload(
      JSON.stringify(jsonData, null, 2),
      `${baseName}.json`,
      "application/json;charset=utf-8",
    );
  } else if (format === "tsv") {
    const tsvContent = [
      headers.join("\t"),
      ...rowsData.map((r) => r.join("\t")),
    ].join("\n");
    triggerDownload(
      tsvContent,
      `${baseName}.tsv`,
      "text/tab-separated-values;charset=utf-8",
    );
  } else {
    // CSV and Excel (CSV with UTF-8 BOM)
    const csvLines = [
      headers.map(escapeCsvValue).join(","),
      ...rowsData.map((r) => r.map(escapeCsvValue).join(",")),
    ];
    const bom = "\uFEFF";
    const csvContent = bom + csvLines.join("\r\n");
    triggerDownload(
      csvContent,
      `${baseName}.${format === "excel" ? "csv" : "csv"}`,
      "text/csv;charset=utf-8",
    );
  }
}
