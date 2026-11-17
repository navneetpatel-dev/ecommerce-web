"use client";

import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import type { DataTableColumn } from "../../types/data-table/types";
import { resolveCell } from "./utils.component";

export type ExportFormat = "csv" | "excel" | "json" | "tsv";

export interface TableExportDropdownProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  selectedIds?: string[];
  getRowId?: (row: T, index: number) => string;
  filename?: string;
  className?: string;
  onExport?: (format: ExportFormat, rowsToExport: T[]) => void;
}

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

export function TableExportDropdown<T>({
  columns,
  rows,
  selectedIds,
  getRowId,
  filename = "table-export",
  className,
  onExport,
}: TableExportDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const exportableColumns = columns.filter(
    (col) => col.id !== "actions" && Boolean(col.header),
  );

  const getRowIdentifier = (row: T, index: number): string => {
    return (
      getRowId?.(row, index) ?? String((row as { id?: unknown }).id ?? index)
    );
  };

  const selectedRows =
    selectedIds && selectedIds.length > 0
      ? rows.filter((row, idx) =>
          selectedIds.includes(getRowIdentifier(row, idx)),
        )
      : [];

  const handleExport = (format: ExportFormat, useSelectedOnly: boolean) => {
    const targetRows =
      useSelectedOnly && selectedRows.length > 0 ? selectedRows : rows;

    if (onExport) {
      onExport(format, targetRows);
      setOpen(false);
      return;
    }

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

    setOpen(false);
  };

  const hasSelection = selectedRows.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={className ?? "h-9 gap-1.5 text-body-sm font-medium"}
          aria-label="Export table data"
        >
          <Download className="size-4 text-ink-muted" aria-hidden />
          <span>Export</span>
          {hasSelection ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-brand/10 text-caption font-semibold text-brand">
              {selectedRows.length}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-56 p-2 space-y-1.5 z-50 bg-surface-raised border-line shadow-elevation-2"
      >
        <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          {hasSelection
            ? `Export Selected (${selectedRows.length})`
            : `Export All (${rows.length})`}
        </p>

        <button
          type="button"
          onClick={() => handleExport("csv", hasSelection)}
          className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-body-sm text-ink hover:bg-surface-muted transition-colors text-left"
        >
          <FileText className="size-4 text-ink-muted" aria-hidden />
          <span>CSV (.csv)</span>
        </button>

        <button
          type="button"
          onClick={() => handleExport("excel", hasSelection)}
          className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-body-sm text-ink hover:bg-surface-muted transition-colors text-left"
        >
          <FileSpreadsheet
            className="size-4 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
          <span>Excel Compatible (.csv)</span>
        </button>

        <button
          type="button"
          onClick={() => handleExport("json", hasSelection)}
          className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-body-sm text-ink hover:bg-surface-muted transition-colors text-left"
        >
          <FileJson
            className="size-4 text-sky-600 dark:text-sky-400"
            aria-hidden
          />
          <span>JSON (.json)</span>
        </button>

        <button
          type="button"
          onClick={() => handleExport("tsv", hasSelection)}
          className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-body-sm text-ink hover:bg-surface-muted transition-colors text-left"
        >
          <FileText
            className="size-4 text-amber-600 dark:text-amber-400"
            aria-hidden
          />
          <span>TSV for Sheets (.tsv)</span>
        </button>

        {hasSelection ? (
          <>
            <div className="my-1 border-t border-line" />
            <button
              type="button"
              onClick={() => handleExport("csv", false)}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-caption text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors text-left"
            >
              <span>Export all rows instead</span>
              <span className="font-mono text-[10px]">({rows.length})</span>
            </button>
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
