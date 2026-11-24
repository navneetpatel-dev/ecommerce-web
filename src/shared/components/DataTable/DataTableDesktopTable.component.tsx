"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Table, TableBody } from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/DataTable/TableScrollShell.component";
import { TABLE_PINNED_LAYOUT_CLASS } from "@/shared/constants/table/table";
import { cn } from "@/shared/utils/dom/cn";
import { dataTableDesktopStyles } from "../../styles/data-table/dataTable.styles";
import type {
  ColumnSortState,
  DataTableColumn,
  TableDensity,
} from "../../types/data-table/types";
import { DataTableDesktopHeader } from "./DataTableDesktopHeader.component";
import { DataTableDesktopRow } from "./DataTableDesktopRow.component";

export type DataTableDesktopTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId?: (row: T, index: number) => string;
  tableLayout: "auto" | "fixed";
  rowsInteractive: boolean;
  density?: TableDensity;
  selectable?: boolean;
  selectedIds?: string[];
  onToggleSelectAll?: () => void;
  onToggleSelectRow?: (rowId: string) => void;
  stickyHeader?: boolean;
  focusedIndex?: number | null;
  ariaLabel?: string;
  actions?: (row: T, index: number) => ReactNode;
  actionsHeader?: ReactNode;
  actionsClassName?: string;
  showViewButton?: boolean;
  enableSorting?: boolean;
  sortStates?: ColumnSortState[];
  onSortColumn?: (columnId: string, isMultiSort: boolean) => void;
  onActivateRow: (row: T, index: number) => void;
  onRowKeyDown: (
    event: KeyboardEvent<HTMLElement>,
    row: T,
    index: number,
  ) => void;
};

export function DataTableDesktopTable<T>({
  columns,
  rows,
  getRowId,
  tableLayout,
  rowsInteractive,
  density,
  selectable,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  stickyHeader = true,
  focusedIndex,
  ariaLabel,
  actions,
  actionsHeader,
  actionsClassName,
  showViewButton = true,
  enableSorting = false,
  sortStates = [],
  onSortColumn,
  onActivateRow,
  onRowKeyDown,
}: DataTableDesktopTableProps<T>) {
  const isCompact = density === "compact";
  const hasActions = Boolean(actions) || (showViewButton && rowsInteractive);
  const rowIds = rows.map(
    (row, idx) =>
      getRowId?.(row, idx) ?? String((row as { id?: unknown }).id ?? idx),
  );
  const isAllSelected =
    rowIds.length > 0 && rowIds.every((id) => selectedIds?.includes(id));
  const isSomeSelected =
    rowIds.some((id) => selectedIds?.includes(id)) && !isAllSelected;

  return (
    <TableScrollShell desktopOnly>
      <Table
        scrollContainer={false}
        aria-label={ariaLabel}
        className={cn(
          hasActions && TABLE_PINNED_LAYOUT_CLASS,
          tableLayout === "fixed" && dataTableDesktopStyles.tableFixed,
        )}
      >
        <DataTableDesktopHeader
          columns={columns}
          tableLayout={tableLayout}
          selectable={selectable}
          isCompact={isCompact}
          stickyHeader={stickyHeader}
          isAllSelected={isAllSelected}
          isSomeSelected={isSomeSelected}
          onToggleSelectAll={onToggleSelectAll}
          enableSorting={enableSorting}
          sortStates={sortStates}
          onSortColumn={onSortColumn}
          hasActions={hasActions}
          actionsHeader={actionsHeader}
          actionsClassName={actionsClassName}
        />
        <TableBody>
          {rows.map((row, index) => {
            const rowId =
              getRowId?.(row, index) ??
              String((row as { id?: unknown }).id ?? index);
            const isSelected = selectedIds?.includes(rowId) ?? false;
            const isFocused = focusedIndex === index;

            return (
              <DataTableDesktopRow
                key={rowId}
                row={row}
                index={index}
                rowId={rowId}
                columns={columns}
                tableLayout={tableLayout}
                rowsInteractive={rowsInteractive}
                isCompact={isCompact}
                isSelected={isSelected}
                isFocused={isFocused}
                selectable={selectable}
                hasActions={hasActions}
                showViewButton={showViewButton}
                actions={actions}
                actionsClassName={actionsClassName}
                onToggleSelectRow={onToggleSelectRow}
                onActivateRow={onActivateRow}
                onRowKeyDown={onRowKeyDown}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableScrollShell>
  );
}
