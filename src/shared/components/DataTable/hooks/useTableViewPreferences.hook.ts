"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  DataTableColumn,
  DataTableProps,
  TableDensity,
} from "../../../types/data-table/types";

type PreferenceProps<T> = Pick<
  DataTableProps<T>,
  | "columns"
  | "tableId"
  | "density"
  | "onDensityChange"
  | "visibleColumnIds"
  | "onVisibleColumnIdsChange"
>;

/** Row density and which columns show in what order, remembered per table. */
export function useTableViewPreferences<T>({
  columns,
  tableId,
  density: controlledDensity,
  onDensityChange,
  visibleColumnIds: controlledVisibleColumnIds,
  onVisibleColumnIdsChange,
}: PreferenceProps<T>) {
  const [internalDensity, setInternalDensity] =
    useState<TableDensity>("comfortable");
  const density = controlledDensity ?? internalDensity;

  const allColumnIds = useMemo(() => columns.map((col) => col.id), [columns]);
  const [internalColumnOrder, setInternalColumnOrder] =
    useState<string[]>(allColumnIds);
  const [internalVisibleColumnIds, setInternalVisibleColumnIds] =
    useState<string[]>(allColumnIds);
  const visibleColumnIds =
    controlledVisibleColumnIds ?? internalVisibleColumnIds;

  // Persistence for tableId (Density, Columns, Order)
  useEffect(() => {
    if (!tableId) return;
    try {
      const storedDensity = localStorage.getItem(
        `datatable-density:${tableId}`,
      );
      if (storedDensity === "comfortable" || storedDensity === "compact") {
        setInternalDensity(storedDensity);
      }

      const storedCols = localStorage.getItem(`datatable-cols:${tableId}`);
      if (storedCols) {
        const parsed = JSON.parse(storedCols);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((id) => allColumnIds.includes(id));
          if (valid.length > 0) {
            setInternalVisibleColumnIds(valid);
          }
        }
      }

      const storedOrder = localStorage.getItem(`datatable-order:${tableId}`);
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((id) => allColumnIds.includes(id));
          const missing = allColumnIds.filter((id) => !valid.includes(id));
          setInternalColumnOrder([...valid, ...missing]);
        }
      }
    } catch {
      // Storage unavailable
    }
  }, [tableId, allColumnIds]);

  const handleDensityChange = (newDensity: TableDensity) => {
    if (controlledDensity === undefined) {
      setInternalDensity(newDensity);
    }
    onDensityChange?.(newDensity);
    if (tableId) {
      try {
        localStorage.setItem(`datatable-density:${tableId}`, newDensity);
      } catch {
        // Storage full/blocked
      }
    }
  };

  const handleVisibleColumnIdsChange = (newIds: string[]) => {
    if (controlledVisibleColumnIds === undefined) {
      setInternalVisibleColumnIds(newIds);
    }
    onVisibleColumnIdsChange?.(newIds);
    if (tableId) {
      try {
        localStorage.setItem(
          `datatable-cols:${tableId}`,
          JSON.stringify(newIds),
        );
      } catch {
        // Storage full/blocked
      }
    }
  };

  const handleResetColumnVisibility = () => {
    handleVisibleColumnIdsChange(allColumnIds);
  };

  const handleColumnOrderChange = (newOrder: string[]) => {
    setInternalColumnOrder(newOrder);
    if (tableId) {
      try {
        localStorage.setItem(
          `datatable-order:${tableId}`,
          JSON.stringify(newOrder),
        );
      } catch {
        // Storage unavailable
      }
    }
  };

  // Reorder columns based on columnOrder
  const orderedColumns = useMemo(() => {
    if (!internalColumnOrder || internalColumnOrder.length === 0)
      return columns;
    const colMap = new Map(columns.map((c) => [c.id, c]));
    const result: DataTableColumn<T>[] = [];
    for (const id of internalColumnOrder) {
      const col = colMap.get(id);
      if (col) {
        result.push(col);
        colMap.delete(id);
      }
    }
    for (const col of colMap.values()) {
      result.push(col);
    }
    return result;
  }, [columns, internalColumnOrder]);

  const activeColumns = orderedColumns.filter((col) =>
    visibleColumnIds.includes(col.id),
  );
  const resolvedColumns =
    activeColumns.length > 0 ? activeColumns : orderedColumns;

  return {
    density,
    visibleColumnIds,
    orderedColumns,
    resolvedColumns,
    handleDensityChange,
    handleVisibleColumnIdsChange,
    handleResetColumnVisibility,
    handleColumnOrderChange,
  };
}
