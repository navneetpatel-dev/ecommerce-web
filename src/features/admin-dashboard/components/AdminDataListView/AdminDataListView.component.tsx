import type { ReactNode } from "react";
import { DataTable } from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import type { AdminDataRow } from "../../hooks/useAdminDataList.hook";
import { useAdminDataListView } from "./useAdminDataListView.hook";

export interface AdminDataListViewProps {
  title: string;
  rows: AdminDataRow[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  actions?: (row: AdminDataRow, reload: () => void) => ReactNode;
  /** Prefer explicit columns; falls back to inferred keys from the first row. */
  columnKeys?: string[];
}

export function AdminDataListView({
  title,
  rows,
  loading,
  error,
  onRefresh,
  page,
  totalPages,
  total,
  from,
  to,
  onPageChange,
  actions,
  columnKeys,
}: AdminDataListViewProps) {
  const { columns, getRowId, renderActions } = useAdminDataListView(
    rows,
    columnKeys,
    actions,
    onRefresh,
  );

  const paginationConfig = { page, totalPages, total, from, to, onPageChange };

  return (
    <DataTable
      title={title}
      columns={columns}
      rows={rows}
      loading={loading}
      error={error}
      emptyMessage={LABELS.noRecordsFound}
      onRefresh={onRefresh}
      getRowId={getRowId}
      pagination={paginationConfig}
      actions={renderActions}
    />
  );
}
