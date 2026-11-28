"use client";

import type { KeyboardEvent } from "react";
import type { DataTableProps } from "../../../types/data-table/types";
import { useTableKeyboardNavigation } from "./useTableKeyboardNavigation.hook";

type ActivationProps<T> = Pick<
  DataTableProps<T>,
  "getRowId" | "onRowClick" | "actions" | "showViewButton"
> & {
  sortedRows: T[];
  rowDetails: boolean;
  selectable: boolean;
  enableKeyboardNavigation: boolean;
  openDetailRow: (row: T, index: number) => void;
  onToggleSelectRow: (rowId: string) => void;
};

/** Opening a row by click or keyboard. */
export function useTableRowActivation<T>({
  sortedRows,
  getRowId,
  onRowClick,
  actions,
  showViewButton,
  rowDetails,
  selectable,
  enableKeyboardNavigation,
  openDetailRow,
  onToggleSelectRow,
}: ActivationProps<T>) {
  const rowsInteractive = Boolean(onRowClick) || rowDetails;
  const shouldShowViewButton =
    showViewButton ?? (Boolean(actions) && rowsInteractive && rowDetails);

  const activateRow = (row: T, index: number) => {
    if (onRowClick) onRowClick(row, index);
    else if (rowDetails) openDetailRow(row, index);
  };

  const onRowKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    row: T,
    index: number,
  ) => {
    if (!rowsInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateRow(row, index);
    }
  };

  const { focusedIndex } = useTableKeyboardNavigation({
    rows: sortedRows,
    enabled:
      enableKeyboardNavigation &&
      sortedRows.length > 0 &&
      (rowsInteractive || selectable),
    getRowId,
    onActivateRow: activateRow,
    selectable,
    onToggleSelectRow,
  });

  return {
    rowsInteractive,
    shouldShowViewButton,
    activateRow,
    onRowKeyDown,
    focusedIndex,
  };
}
