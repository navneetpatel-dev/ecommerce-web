"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Eye } from "lucide-react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
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
  selectable?: boolean;
  selectedIds?: string[];
  onToggleSelectRow?: (rowId: string) => void;
  actions?: (row: T, index: number) => ReactNode;
  showViewButton?: boolean;
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
  selectable,
  selectedIds,
  onToggleSelectRow,
  actions,
  showViewButton = true,
  onActivateRow,
  onRowKeyDown,
}: DataTableMobileCardsProps<T>) {
  const mobileColumns = columns.filter((column) => !column.hideOnMobile);
  const hasActions = Boolean(actions) || (showViewButton && rowsInteractive);

  return (
    <ul className={dataTableMobileStyles.list}>
      {rows.map((row, index) => {
        const rowId =
          getRowId?.(row, index) ??
          String((row as { id?: unknown }).id ?? index);
        const isSelected = selectedIds?.includes(rowId) ?? false;
        const [primary, ...rest] = mobileColumns;
        const primaryContent = primary
          ? resolveCell(primary, row, index)
          : null;

        const rowActivationProps = rowsInteractive
          ? {
              role: "button" as const,
              tabIndex: 0,
              onClick: () => onActivateRow(row, index),
              onKeyDown: (event: KeyboardEvent<HTMLElement>) =>
                onRowKeyDown(event, row, index),
            }
          : {};

        return (
          <li
            key={rowId}
            data-state={isSelected ? "selected" : undefined}
            className={cn(
              dataTableMobileStyles.card,
              isSelected && "ring-2 ring-brand/50 bg-brand/5",
            )}
          >
            {selectable && (
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-line">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- Checkbox renders the control */}
                <label className="flex items-center gap-2 cursor-pointer text-caption text-ink font-medium">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelectRow?.(rowId)}
                    aria-label={`Select item ${rowId}`}
                  />
                  <span>Select</span>
                </label>
              </div>
            )}
            <div
              className={cn(
                rowsInteractive && dataTableMobileStyles.cardInteractive,
              )}
              {...rowActivationProps}
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
            </div>

            {hasActions ? (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <TableRowActions>
                  {showViewButton && rowsInteractive ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className={tableMenuButtonClass("neutral")}
                      onClick={() => onActivateRow(row, index)}
                      aria-label={LABELS.view}
                    >
                      <Eye className="size-3.5" strokeWidth={2} aria-hidden />
                      <span>{LABELS.view}</span>
                    </Button>
                  ) : null}
                  {actions?.(row, index)}
                </TableRowActions>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
