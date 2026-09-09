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
import { TableRowActions } from "@/shared/components/TableRowActions.component";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { LABELS } from "@/shared/constants/labels";
import {
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_DATA_CELL_CLASS,
  TABLE_PINNED_LAYOUT_CLASS,
} from "@/shared/constants/table/table";
import { cn } from "@/shared/utils/dom/cn";
import { dataTableDesktopStyles } from "../../styles/data-table/dataTable.styles";
import type { DataTableColumn } from "../../types/data-table/types";
import { renderCellContent, resolveCell } from "./utils.component";

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
          tableLayout === "fixed" && dataTableDesktopStyles.tableFixed,
        )}
      >
        <TableHeader>
          <TableRow className={dataTableDesktopStyles.headerRow}>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  TABLE_DATA_CELL_CLASS,
                  tableLayout === "auto" &&
                    column.truncate !== false &&
                    dataTableDesktopStyles.headAutoTruncate,
                  dataTableDesktopStyles.headText,
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
                  rowsInteractive && dataTableDesktopStyles.rowInteractive,
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
                        tableLayout === "fixed" &&
                          dataTableDesktopStyles.cellFixed,
                        tableLayout === "auto" &&
                          column.truncate !== false &&
                          dataTableDesktopStyles.cellAutoTruncate,
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
