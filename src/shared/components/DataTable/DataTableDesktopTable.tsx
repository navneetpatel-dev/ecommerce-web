"use client";

import type { KeyboardEvent, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { TableRowActions } from "@/shared/components/TableRowActions";
import { TableScrollShell } from "@/shared/components/TableScrollShell";
import { LABELS } from "@/shared/constants/labels";
import {
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_DATA_CELL_CLASS,
  TABLE_PINNED_LAYOUT_CLASS,
} from "@/shared/constants/table";
import { cn } from "@/shared/utils/cn";
import type { DataTableColumn } from "./types";
import { renderCellContent, resolveCell } from "./utils";

export type DataTableDesktopTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId?: (row: T, index: number) => string;
  tableLayout: "auto" | "fixed";
  rowsInteractive: boolean;
  actions?: (row: T, index: number) => ReactNode;
  actionsHeader?: ReactNode;
  actionsClassName?: string;
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
  actions,
  actionsHeader,
  actionsClassName,
  onActivateRow,
  onRowKeyDown,
}: DataTableDesktopTableProps<T>) {
  return (
    <TableScrollShell desktopOnly>
      <Table
        scrollContainer={false}
        className={cn(
          actions && TABLE_PINNED_LAYOUT_CLASS,
          tableLayout === "fixed" && "table-fixed w-full min-w-0",
        )}
      >
        <TableHeader>
          <TableRow className="border-line bg-paper/70 hover:bg-paper/70">
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  TABLE_DATA_CELL_CLASS,
                  tableLayout === "auto" &&
                    column.truncate !== false &&
                    "max-w-[14rem]",
                  "text-[0.75rem] uppercase tracking-[0.04em]",
                  column.headerClassName,
                )}
              >
                {column.header}
              </TableHead>
            ))}
            {actions ? (
              <TableHead
                className={cn(TABLE_ACTIONS_HEAD_CLASS, actionsClassName)}
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
            return (
              <TableRow
                key={rowId}
                className={cn(
                  rowsInteractive &&
                    "cursor-pointer hover:bg-brand-subtle/25 focus-visible:bg-brand-subtle/25",
                )}
                tabIndex={rowsInteractive ? 0 : undefined}
                aria-label={
                  rowsInteractive ? LABELS.viewRecordDetails : undefined
                }
                onClick={() => onActivateRow(row, index)}
                onKeyDown={(event) => onRowKeyDown(event, row, index)}
              >
                {columns.map((column) => {
                  const content = resolveCell(column, row, index);
                  return (
                    <TableCell
                      key={column.id}
                      className={cn(
                        TABLE_DATA_CELL_CLASS,
                        tableLayout === "fixed" && "max-w-0",
                        tableLayout === "auto" &&
                          column.truncate !== false &&
                          "max-w-[14rem]",
                        column.className,
                      )}
                    >
                      {renderCellContent(column, content, row)}
                    </TableCell>
                  );
                })}
                {actions ? (
                  <TableCell
                    className={cn(TABLE_ACTIONS_CELL_CLASS, actionsClassName)}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
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
