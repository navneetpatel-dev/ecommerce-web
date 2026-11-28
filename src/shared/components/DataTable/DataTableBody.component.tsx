"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Inbox } from "lucide-react";
import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { QueryErrorAlert } from "@/shared/components/notices/QueryErrorAlert.component";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { dataTableStyles } from "../../styles/data-table/dataTable.styles";
import type {
  ColumnSortState,
  DataTableColumn,
  DataTableProps,
  TableDensity,
} from "../../types/data-table/types";
import { DataTableDesktopTable } from "./DataTableDesktopTable.component";
import { DataTableMobileCards } from "./DataTableMobileCards.component";

interface DataTableBodyProps<T> {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  emptyMessage: string;
  onRefresh?: () => void;
  resolvedColumns: DataTableColumn<T>[];
  sortedRows: T[];
  getRowId?: DataTableProps<T>["getRowId"];
  tableLayout: "auto" | "fixed";
  rowsInteractive: boolean;
  density: TableDensity;
  selectable: boolean;
  selectedIds: string[];
  handleToggleSelectAll: () => void;
  handleToggleSelectRow: (rowId: string) => void;
  stickyHeader: boolean;
  focusedIndex: number | null;
  resolvedAriaLabel?: string;
  actions?: DataTableProps<T>["actions"];
  actionsHeader: ReactNode;
  actionsClassName?: string;
  shouldShowViewButton: boolean;
  enableSorting: boolean;
  sortStates: ColumnSortState[];
  handleSortColumn: (columnId: string, isMultiSort: boolean) => void;
  activateRow: (row: T, index: number) => void;
  onRowKeyDown: (
    event: KeyboardEvent<HTMLElement>,
    row: T,
    index: number,
  ) => void;
}

/** The table itself, or its error, loading or empty state. */
export function DataTableBody<T>({
  loading,
  refreshing,
  error,
  emptyMessage,
  onRefresh,
  resolvedColumns,
  sortedRows,
  getRowId,
  tableLayout,
  rowsInteractive,
  density,
  selectable,
  selectedIds,
  handleToggleSelectAll,
  handleToggleSelectRow,
  stickyHeader,
  focusedIndex,
  resolvedAriaLabel,
  actions,
  actionsHeader,
  actionsClassName,
  shouldShowViewButton,
  enableSorting,
  sortStates,
  handleSortColumn,
  activateRow,
  onRowKeyDown,
}: DataTableBodyProps<T>) {
  return (
    <>
      {error ? (
        <div className={dataTableStyles.errorBox}>
          <QueryErrorAlert error={error} fallback={error} onRetry={onRefresh} />
        </div>
      ) : null}

      {refreshing && !loading ? (
        <span role="status" className={dataTableStyles.loadingHint}>
          {LABELS.refreshing}
        </span>
      ) : null}

      {loading ? (
        <>
          <span className={dataTableStyles.loadingHint}>{LABELS.loading}</span>
          <SkeletonRows count={6} height={dataTableStyles.skeletonHeight} />
        </>
      ) : sortedRows.length === 0 ? (
        <EmptyState icon={Inbox} message={emptyMessage} />
      ) : (
        <>
          {/* Below lg: stacked cards — row actions collapse to kebab */}
          <DataTableMobileCards
            columns={resolvedColumns}
            rows={sortedRows}
            getRowId={getRowId}
            rowsInteractive={rowsInteractive}
            selectable={selectable}
            selectedIds={selectedIds}
            onToggleSelectRow={handleToggleSelectRow}
            actions={actions}
            showViewButton={shouldShowViewButton}
            onActivateRow={activateRow}
            onRowKeyDown={onRowKeyDown}
          />

          {/* lg+: scrollable data columns + pinned actions */}
          <DataTableDesktopTable
            columns={resolvedColumns}
            rows={sortedRows}
            getRowId={getRowId}
            tableLayout={tableLayout}
            rowsInteractive={rowsInteractive}
            density={density}
            selectable={selectable}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectRow={handleToggleSelectRow}
            stickyHeader={stickyHeader}
            focusedIndex={focusedIndex}
            ariaLabel={resolvedAriaLabel}
            actions={actions}
            actionsHeader={actionsHeader}
            actionsClassName={actionsClassName}
            showViewButton={shouldShowViewButton}
            enableSorting={enableSorting}
            sortStates={sortStates}
            onSortColumn={handleSortColumn}
            onActivateRow={activateRow}
            onRowKeyDown={onRowKeyDown}
          />
        </>
      )}
    </>
  );
}
