import type { ReactNode } from "react";
import { DataTable } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import type { AdminDataRow } from "../../../hooks/shared/useAdminDataList.hook";
import { useAdminDataListView } from "../../../hooks/shared/useAdminDataListView.hook";

export interface AdminDataListViewProps {
  title: string;
  rows: AdminDataRow[];
  loading: boolean;
  /** Background reload in progress — rows stay mounted with a status hint. */
  refreshing?: boolean;
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
  titleLevel?: 1 | 2;
  onRowClick?: (row: AdminDataRow) => void;
}

export function AdminDataListView({
  title,
  rows,
  loading,
  refreshing,
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
  titleLevel,
  onRowClick,
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
      titleLevel={titleLevel}
      columns={columns}
      rows={rows}
      loading={loading}
      refreshing={refreshing}
      error={error}
      emptyMessage={LABELS.noRecordsFound}
      onRefresh={onRefresh}
      getRowId={getRowId}
      pagination={paginationConfig}
      actions={renderActions}
      onRowClick={onRowClick}
      tableId={`admin-${title.toLowerCase().replace(/\s+/g, "-")}`}
      enableColumnVisibility
      enableDensityToggle
      enableExport
      enableSorting
      enableFullscreen
    />
  );
}
