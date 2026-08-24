"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { TableRowActions } from "@/shared/components/TableRowActions.component";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import type { DataTableColumn } from "./types";
import { columnLabel, renderCellContent, resolveCell } from "./utils.component";

export type DataTableMobileCardsProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId?: (row: T, index: number) => string;
  rowsInteractive: boolean;
  actions?: (row: T, index: number) => ReactNode;
  onActivateRow: (row: T, index: number) => void;
  onRowKeyDown: (
    event: KeyboardEvent<HTMLElement>,
    row: T,
    index: number,
  ) => void;
};

export function DataTableMobileCards<T>({
  columns,
  rows,
  getRowId,
  rowsInteractive,
  actions,
  onActivateRow,
  onRowKeyDown,
}: DataTableMobileCardsProps<T>) {
  const mobileColumns = columns.filter((column) => !column.hideOnMobile);

  return (
    <ul className="space-y-3 lg:hidden">
      {rows.map((row, index) => {
        const rowId =
          getRowId?.(row, index) ??
          String((row as { id?: unknown }).id ?? index);
        const [primary, ...rest] = mobileColumns;
        const primaryContent = primary
          ? resolveCell(primary, row, index)
          : null;

        return (
          <li
            key={rowId}
            className={cn(
              "rounded-md border border-line bg-surface p-4 shadow-card-hairline",
              rowsInteractive &&
                "cursor-pointer transition-colors hover:border-brand/30 hover:bg-brand-subtle/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            )}
            role={rowsInteractive ? "button" : undefined}
            tabIndex={rowsInteractive ? 0 : undefined}
            aria-label={rowsInteractive ? LABELS.viewRecordDetails : undefined}
            onClick={() => onActivateRow(row, index)}
            onKeyDown={(event) => onRowKeyDown(event, row, index)}
          >
            {primary ? (
              <div
                className={cn("min-w-0 text-body text-ink", primary.className)}
              >
                {renderCellContent(primary, primaryContent, row)}
              </div>
            ) : null}

            {rest.length > 0 ? (
              <dl
                className={cn(
                  "space-y-2.5",
                  primary ? "mt-3 border-t border-line/80 pt-3" : undefined,
                )}
              >
                {rest.map((column) => {
                  const content = resolveCell(column, row, index);
                  return (
                    <div
                      key={column.id}
                      className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] gap-x-3 gap-y-1"
                    >
                      <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
                        {columnLabel(column)}
                      </dt>
                      <dd
                        className={cn(
                          "min-w-0 break-words text-[0.875rem] text-ink",
                          column.className,
                        )}
                      >
                        {renderCellContent(column, content, row)}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            ) : null}

            {actions ? (
              <div
                className={cn(
                  primary || rest.length > 0
                    ? "mt-4 border-t border-line/80 pt-3"
                    : undefined,
                )}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <TableRowActions className="justify-end">
                  {actions(row, index)}
                </TableRowActions>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
