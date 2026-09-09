"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import type {
  ReportColumnMeta,
  ReportRunResult,
} from "../../api/table/reportsEngine.api";
import { formatReportCell } from "../../utils/table/formatReportCell";
import { reportTableStyles as styles } from "./reportTable.styles";

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
  const metaMismatch = Boolean(
    result?.meta &&
    (result.meta.balanced === false ||
      String(result.meta.status ?? "") === "MISMATCH"),
  );
  const mismatchMessage = metaError || LABELS.reconciliationMismatch;
  const mismatchNotice = metaMismatch ? (
    <p className={styles.mismatchNotice}>{mismatchMessage}</p>
  ) : null;
  const rows = result?.rows ?? [];
  const onRefresh = error ? onRetry : undefined;

  return (
    <div className={styles.container}>
      {mismatchNotice}
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        emptyMessage={LABELS.noResults}
        pagination={pagination}
        rowDetails={false}
        tableLayout="fixed"
      />
    </div>
  );
}
