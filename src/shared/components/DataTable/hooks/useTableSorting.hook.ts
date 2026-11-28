"use client";

import { useMemo, useState } from "react";
import type {
  ColumnSortState,
  DataTableColumn,
  DataTableProps,
} from "../../../types/data-table/types";
import { resolveCell } from "../utils.component";

type SortingProps<T> = Pick<
  DataTableProps<T>,
  "rows" | "enableSorting" | "sortStates" | "onSortChange"
> & { orderedColumns: DataTableColumn<T>[] };

/** Sorting by one or several columns (shift-click adds one), applied to the loaded rows. */
export function useTableSorting<T>({
  rows,
  enableSorting,
  sortStates: controlledSortStates,
  onSortChange,
  orderedColumns,
}: SortingProps<T>) {
  const [internalSortStates, setInternalSortStates] = useState<
    ColumnSortState[]
  >([]);
  const sortStates = controlledSortStates ?? internalSortStates;

  const handleSortColumn = (colId: string, isMultiSort: boolean) => {
    let nextSorts: ColumnSortState[] = [];
    const existingIndex = sortStates.findIndex((s) => s.columnId === colId);
    const existing = sortStates[existingIndex];

    if (!isMultiSort) {
      if (!existing) {
        nextSorts = [{ columnId: colId, direction: "asc" }];
      } else if (existing.direction === "asc") {
        nextSorts = [{ columnId: colId, direction: "desc" }];
      } else {
        nextSorts = [];
      }
    } else {
      if (!existing) {
        nextSorts = [...sortStates, { columnId: colId, direction: "asc" }];
      } else if (existing.direction === "asc") {
        nextSorts = sortStates.map((s, idx) =>
          idx === existingIndex ? { ...s, direction: "desc" as const } : s,
        );
      } else {
        nextSorts = sortStates.filter((s) => s.columnId !== colId);
      }
    }

    if (controlledSortStates === undefined) {
      setInternalSortStates(nextSorts);
    }
    onSortChange?.(nextSorts);
  };

  // Client-side multi-sorting of rows
  const sortedRows = useMemo(() => {
    if (!enableSorting || !sortStates || sortStates.length === 0) return rows;
    return [...rows].sort((a, b) => {
      for (const sort of sortStates) {
        const col = orderedColumns.find((c) => c.id === sort.columnId);
        if (!col) continue;
        const rawA = col.accessor ? a[col.accessor] : resolveCell(col, a, 0);
        const rawB = col.accessor ? b[col.accessor] : resolveCell(col, b, 0);
        if (rawA === rawB) continue;
        if (rawA == null) return 1;
        if (rawB == null) return -1;
        const strA =
          typeof rawA === "object" ? JSON.stringify(rawA) : String(rawA);
        const strB =
          typeof rawB === "object" ? JSON.stringify(rawB) : String(rawB);
        const cmp = strA.localeCompare(strB, undefined, {
          numeric: true,
          sensitivity: "base",
        });
        if (cmp !== 0) {
          return sort.direction === "asc" ? cmp : -cmp;
        }
      }
      return 0;
    });
  }, [rows, sortStates, orderedColumns, enableSorting]);

  return { sortStates, sortedRows, handleSortColumn };
}
