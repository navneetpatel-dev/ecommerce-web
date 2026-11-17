"use client";

import type { KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import { TableScrollShell } from "@/shared/components/DataTable/TableScrollShell.component";
import {
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_DATA_CELL_CLASS,
  TABLE_PINNED_LAYOUT_CLASS,
} from "@/shared/constants/table/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/utils/dom/cn";
import { dataTableDesktopStyles } from "../../styles/data-table/dataTable.styles";
import type {
  ColumnSortState,
  DataTableColumn,
  TableDensity,
} from "../../types/data-table/types";
import { renderCellContent, resolveCell } from "./utils.component";

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
  /** Accessible name for the table (the section title, when it is text). */
  ariaLabel?: string;
  actions?: (row: T, index: number) => ReactNode;
  actionsHeader?: ReactNode;
  actionsClassName?: string;
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
  enableSorting = false,
  sortStates = [],
  onSortColumn,
  onActivateRow,
  onRowKeyDown,
}: DataTableDesktopTableProps<T>) {
  const isCompact = density === "compact";
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
          actions && TABLE_PINNED_LAYOUT_CLASS,
          tableLayout === "fixed" && dataTableDesktopStyles.tableFixed,
        )}
      >
        <TableHeader className={cn(stickyHeader && "sticky top-0 z-10")}>
          <TableRow className={dataTableDesktopStyles.headerRow}>
            {selectable && (
              <TableHead
                scope="col"
                className={cn(
                  "w-10 px-3 text-center align-middle",
                  isCompact && "h-8 py-1",
                  stickyHeader &&
                    "sticky top-0 left-0 z-20 bg-[color-mix(in_srgb,var(--paper)_80%,var(--surface))]/95 backdrop-blur-md shadow-[0_1px_0_0_var(--line)]",
                )}
              >
                <Checkbox
                  checked={
                    isAllSelected
                      ? true
                      : isSomeSelected
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={onToggleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            )}
            {columns.map((column) => {
              const isSortable = enableSorting && column.sortable !== false;
              const activeSortIndex = sortStates.findIndex(
                (s) => s.columnId === column.id,
              );
              const activeSort =
                activeSortIndex >= 0 ? sortStates[activeSortIndex] : undefined;
              const sortDirection = activeSort?.direction;
              const isMultiSorted =
                sortStates.length > 1 && activeSortIndex >= 0;

              return (
                <TableHead
                  key={column.id}
                  scope="col"
                  aria-sort={
                    sortDirection === "asc"
                      ? "ascending"
                      : sortDirection === "desc"
                        ? "descending"
                        : "none"
                  }
                  onClick={
                    isSortable
                      ? (e) => onSortColumn?.(column.id, e.shiftKey)
                      : undefined
                  }
                  className={cn(
                    TABLE_DATA_CELL_CLASS,
                    tableLayout === "auto" &&
                      column.truncate !== false &&
                      dataTableDesktopStyles.headAutoTruncate,
                    dataTableDesktopStyles.headText,
                    isSortable &&
                      "cursor-pointer select-none group/col hover:text-ink transition-colors",
                    isCompact && "h-8 px-2.5 py-1 text-[11px]",
                    stickyHeader &&
                      "sticky top-0 z-10 bg-[color-mix(in_srgb,var(--paper)_80%,var(--surface))]/95 backdrop-blur-md shadow-[0_1px_0_0_var(--line)]",
                    column.headerClassName,
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate">{column.header}</span>
                    {isSortable && (
                      <span className="inline-flex items-center gap-0.5 shrink-0">
                        {sortDirection === "asc" ? (
                          <ArrowUp
                            className="size-3.5 text-brand"
                            aria-hidden
                          />
                        ) : sortDirection === "desc" ? (
                          <ArrowDown
                            className="size-3.5 text-brand"
                            aria-hidden
                          />
                        ) : (
                          <ArrowUpDown
                            className="size-3 text-ink-muted/30 opacity-0 group-hover/col:opacity-100 transition-opacity"
                            aria-hidden
                          />
                        )}
                        {isMultiSorted && (
                          <span
                            className="flex size-3.5 items-center justify-center rounded-full bg-brand/15 text-[9px] font-bold text-brand leading-none"
                            title={`Sort priority ${activeSortIndex + 1} (Shift-click to toggle)`}
                          >
                            {activeSortIndex + 1}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              );
            })}
            {actions ? (
              <TableHead
                scope="col"
                className={cn(
                  TABLE_ACTIONS_HEAD_CLASS,
                  isCompact && "h-8 py-1 text-[11px]",
                  stickyHeader &&
                    "sticky top-0 right-0 z-20 bg-[color-mix(in_srgb,var(--paper)_80%,var(--surface))]/95 backdrop-blur-md shadow-[0_1px_0_0_var(--line)]",
                  actionsClassName,
                )}
              >
                {actionsHeader}
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            const rowId =
              getRowId?.(row, index) ??
              String((row as { id?: unknown }).id ?? index);
            const isSelected = selectedIds?.includes(rowId) ?? false;
            const isFocused = focusedIndex === index;
            const activateRow = () => onActivateRow(row, index);
            const handleRowKeyDown = (event: KeyboardEvent<HTMLElement>) =>
              onRowKeyDown(event, row, index);
            const stopRowEvent = (event: SyntheticEvent) =>
              event.stopPropagation();

            return (
              <TableRow
                key={rowId}
                data-state={isSelected ? "selected" : undefined}
                data-focused={isFocused ? "true" : undefined}
                className={cn(
                  rowsInteractive && dataTableDesktopStyles.rowInteractive,
                  isSelected && "bg-brand/5 hover:bg-brand/10",
                  isFocused &&
                    "ring-2 ring-inset ring-brand bg-brand-subtle/30",
                )}
                tabIndex={rowsInteractive ? 0 : undefined}
                onClick={activateRow}
                onKeyDown={handleRowKeyDown}
              >
                {selectable && (
                  <TableCell
                    className={cn(
                      "w-10 px-3 text-center align-middle",
                      isCompact && "py-1.5",
                    )}
                    onClick={stopRowEvent}
                    onKeyDown={stopRowEvent}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelectRow?.(rowId)}
                      aria-label={`Select row ${rowId}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => {
                  const content = resolveCell(column, row, index);
                  return (
                    <TableCell
                      key={column.id}
                      className={cn(
                        TABLE_DATA_CELL_CLASS,
                        tableLayout === "fixed" &&
                          dataTableDesktopStyles.cellFixed,
                        tableLayout === "auto" &&
                          column.truncate !== false &&
                          dataTableDesktopStyles.cellAutoTruncate,
                        isCompact && "py-1.5 px-2.5 text-caption",
                        column.className,
                      )}
                    >
                      {renderCellContent(column, content, row)}
                    </TableCell>
                  );
                })}
                {actions ? (
                  <TableCell
                    className={cn(
                      TABLE_ACTIONS_CELL_CLASS,
                      isCompact && "py-1.5",
                      actionsClassName,
                    )}
                    onClick={stopRowEvent}
                    onKeyDown={stopRowEvent}
                  >
                    <TableRowActions>{actions(row, index)}</TableRowActions>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableScrollShell>
  );
}
