"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { TableRowActions } from "@/shared/components/TableRowActions.component";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { dataTableMobileStyles } from "../../styles/data-table/dataTable.styles";
import type { DataTableColumn } from "../../types/data-table/types";
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
    <ul className={dataTableMobileStyles.list}>
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
              dataTableMobileStyles.card,
              rowsInteractive && dataTableMobileStyles.cardInteractive,
            )}
            role={rowsInteractive ? "button" : undefined}
            tabIndex={rowsInteractive ? 0 : undefined}
            aria-label={rowsInteractive ? LABELS.viewRecordDetails : undefined}
            onClick={() => onActivateRow(row, index)}
            onKeyDown={(event) => onRowKeyDown(event, row, index)}
          >
            {primary ? (
              <div
                className={cn(
                  primary.className,
                  dataTableMobileStyles.primaryCell,
                )}
              >
                {renderCellContent(
                  { ...primary, truncate: false },
                  primaryContent,
                  row,
                )}
              </div>
            ) : null}

            {rest.length > 0 ? (
              <dl
                className={cn(
                  dataTableMobileStyles.dl,
                  primary ? dataTableMobileStyles.dlWithPrimary : undefined,
                )}
              >
                {rest.map((column) => {
                  const content = resolveCell(column, row, index);
                  return (
                    <div
                      key={column.id}
                      className={cn(
                        dataTableMobileStyles.rowItem,
                        column.mobileRowClassName,
                      )}
                    >
                      <dt className={dataTableMobileStyles.dt}>
                        {columnLabel(column)}
                      </dt>
                      <dd
                        className={cn(
                          column.className,
                          dataTableMobileStyles.dd,
                        )}
                      >
                        {renderCellContent(
                          { ...column, truncate: false },
                          content,
                          row,
                        )}
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
                    ? dataTableMobileStyles.actionsWrapper
                    : undefined,
                )}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <TableRowActions className={dataTableMobileStyles.actionsAlign}>
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
