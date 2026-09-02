"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import type {
  ReportColumnMeta,
  ReportRunResult,
} from "../api/reportsEngine.api";
import { formatReportCell } from "../utils/formatReportCell";

interface ReportTableProps {
  result: ReportRunResult | null;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
}

export function ReportTable({
  result,
  loading,
  error,
  onPageChange,
  onRetry,
}: ReportTableProps) {
  const columns: DataTableColumn<Record<string, unknown>>[] =
    result?.columns.map((col: ReportColumnMeta) => {
      const labelMap = LABELS as Record<string, string>;
      return {
        id: col.key,
        header: labelMap[col.labelKey] ?? col.labelKey,
        cell: (row: Record<string, unknown>) =>
          formatReportCell(row[col.key], col.format, col.key),
      };
    }) ?? [];

  const pagination = result
    ? {
        page: result.pagination.page,
        totalPages: result.pagination.totalPages,
        onPageChange,
        total: result.pagination.total,
        from:
          result.pagination.total > 0
            ? (result.pagination.page - 1) * result.pagination.limit + 1
            : 0,
        to: Math.min(
          result.pagination.page * result.pagination.limit,
          result.pagination.total,
        ),
      }
    : undefined;

  const metaError =
    result?.meta && typeof result.meta.error === "string"
      ? result.meta.error
      : null;
  const metaMismatch =
    result?.meta &&
    (result.meta.balanced === false ||
      String(result.meta.status ?? "") === "MISMATCH");

  return (
    <div className="space-y-3">
      {metaMismatch ? (
        <p className="rounded-md border border-danger/40 bg-danger/5 px-3 py-2 text-[0.875rem] text-danger">
          {metaError || LABELS.reconciliationMismatch}
        </p>
      ) : null}
      <DataTable
        columns={columns}
        rows={result?.rows ?? []}
        loading={loading}
        error={error}
        onRefresh={error ? onRetry : undefined}
        emptyMessage={LABELS.noResults}
        pagination={pagination}
        rowDetails={false}
        tableLayout="fixed"
      />
    </div>
  );
}
