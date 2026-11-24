"use client";

import type { KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { Eye } from "lucide-react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import {
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_DATA_CELL_CLASS,
} from "@/shared/constants/table/table";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/utils/dom/cn";
import { dataTableDesktopStyles } from "../../styles/data-table/dataTable.styles";
import type { DataTableColumn } from "../../types/data-table/types";
import { renderCellContent, resolveCell } from "./utils.component";

export interface DataTableDesktopRowProps<T> {
  row: T;
  index: number;
  rowId: string;
  columns: DataTableColumn<T>[];
  tableLayout: "auto" | "fixed";
  rowsInteractive: boolean;
  isCompact: boolean;
  isSelected: boolean;
  isFocused: boolean;
  selectable?: boolean;
  hasActions: boolean;
  showViewButton: boolean;
  actions?: (row: T, index: number) => ReactNode;
  actionsClassName?: string;
  onToggleSelectRow?: (rowId: string) => void;
  onActivateRow: (row: T, index: number) => void;
  onRowKeyDown: (
    event: KeyboardEvent<HTMLElement>,
    row: T,
    index: number,
  ) => void;
}

export function DataTableDesktopRow<T>({
  row,
  index,
  rowId,
  columns,
  tableLayout,
  rowsInteractive,
  isCompact,
  isSelected,
  isFocused,
  selectable,
  hasActions,
  showViewButton,
  actions,
  actionsClassName,
  onToggleSelectRow,
  onActivateRow,
  onRowKeyDown,
}: DataTableDesktopRowProps<T>) {
  const activateRow = () => onActivateRow(row, index);
  const handleRowKeyDown = (event: KeyboardEvent<HTMLElement>) =>
    onRowKeyDown(event, row, index);
  const stopRowEvent = (event: SyntheticEvent) => event.stopPropagation();

  return (
    <TableRow
      key={rowId}
      data-state={isSelected ? "selected" : undefined}
      data-focused={isFocused ? "true" : undefined}
      className={cn(
        rowsInteractive && dataTableDesktopStyles.rowInteractive,
        isSelected && "bg-brand/5 hover:bg-brand/10",
        isFocused && "ring-2 ring-inset ring-brand bg-brand-subtle/30",
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
              tableLayout === "fixed" && dataTableDesktopStyles.cellFixed,
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
      {hasActions ? (
        <TableCell
          className={cn(
            TABLE_ACTIONS_CELL_CLASS,
            isCompact && "py-1.5",
            actionsClassName,
          )}
          onClick={stopRowEvent}
          onKeyDown={stopRowEvent}
        >
          <TableRowActions>
            {showViewButton && rowsInteractive ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={tableMenuButtonClass("neutral")}
                onClick={activateRow}
                aria-label={LABELS.view}
              >
                <Eye className="size-3.5" strokeWidth={2} aria-hidden />
                <span>{LABELS.view}</span>
              </Button>
            ) : null}
            {actions?.(row, index)}
          </TableRowActions>
        </TableCell>
      ) : null}
    </TableRow>
  );
}
