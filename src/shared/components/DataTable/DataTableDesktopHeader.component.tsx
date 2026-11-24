"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import {
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_DATA_CELL_CLASS,
} from "@/shared/constants/table/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/utils/dom/cn";
import { dataTableDesktopStyles } from "../../styles/data-table/dataTable.styles";
import type {
  ColumnSortState,
  DataTableColumn,
} from "../../types/data-table/types";

export interface DataTableDesktopHeaderProps<T> {
  columns: DataTableColumn<T>[];
  tableLayout: "auto" | "fixed";
  selectable?: boolean;
  isCompact: boolean;
  stickyHeader: boolean;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onToggleSelectAll?: () => void;
  enableSorting?: boolean;
  sortStates?: ColumnSortState[];
  onSortColumn?: (columnId: string, isMultiSort: boolean) => void;
  hasActions: boolean;
  actionsHeader?: ReactNode;
  actionsClassName?: string;
}

export function DataTableDesktopHeader<T>({
  columns,
  tableLayout,
  selectable,
  isCompact,
  stickyHeader,
  isAllSelected,
  isSomeSelected,
  onToggleSelectAll,
  enableSorting = false,
  sortStates = [],
  onSortColumn,
  hasActions,
  actionsHeader,
  actionsClassName,
}: DataTableDesktopHeaderProps<T>) {
  return (
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
                isAllSelected ? true : isSomeSelected ? "indeterminate" : false
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
          const isMultiSorted = sortStates.length > 1 && activeSortIndex >= 0;

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
                      <ArrowUp className="size-3.5 text-brand" aria-hidden />
                    ) : sortDirection === "desc" ? (
                      <ArrowDown className="size-3.5 text-brand" aria-hidden />
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
        {hasActions ? (
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
  );
}
