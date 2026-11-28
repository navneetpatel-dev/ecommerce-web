"use client";

import { useState } from "react";
import type { DataTableProps } from "../../../types/data-table/types";

type SelectionProps<T> = Pick<
  DataTableProps<T>,
  "rows" | "getRowId" | "selectedIds" | "onSelectionChange"
>;

/** Which rows are ticked, controlled by the page or kept here. */
export function useTableSelection<T>({
  rows,
  getRowId,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
}: SelectionProps<T>) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const selectedIds = controlledSelectedIds ?? internalSelectedIds;

  // Row selection handlers
  const rowIds = rows.map(
    (row, idx) =>
      getRowId?.(row, idx) ?? String((row as { id?: unknown }).id ?? idx),
  );

  const handleToggleSelectAll = () => {
    const isAllSelected =
      rowIds.length > 0 && rowIds.every((id) => selectedIds.includes(id));
    const nextSelected = isAllSelected ? [] : [...rowIds];
    if (controlledSelectedIds === undefined) {
      setInternalSelectedIds(nextSelected);
    }
    onSelectionChange?.(nextSelected);
  };

  const handleToggleSelectRow = (rowId: string) => {
    const nextSelected = selectedIds.includes(rowId)
      ? selectedIds.filter((id) => id !== rowId)
      : [...selectedIds, rowId];
    if (controlledSelectedIds === undefined) {
      setInternalSelectedIds(nextSelected);
    }
    onSelectionChange?.(nextSelected);
  };

  const handleClearSelection = () => {
    if (controlledSelectedIds === undefined) {
      setInternalSelectedIds([]);
    }
    onSelectionChange?.([]);
  };

  return {
    selectedIds,
    handleToggleSelectAll,
    handleToggleSelectRow,
    handleClearSelection,
  };
}
