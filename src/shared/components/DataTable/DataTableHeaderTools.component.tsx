"use client";

import type { ReactNode } from "react";
import type {
  DataTableColumn,
  TableDensity,
} from "../../types/data-table/types";
import { ColumnVisibilityDropdown } from "./ColumnVisibilityDropdown.component";
import { RowDensityToggle } from "./RowDensityToggle.component";
import { TableExportDropdown } from "./TableExportDropdown.component";

interface DataTableHeaderToolsProps<T> {
  toolbar?: ReactNode;
  enableDensityToggle: boolean;
  enableColumnVisibility: boolean;
  enableExport: boolean;
  density: TableDensity;
  orderedColumns: DataTableColumn<T>[];
  visibleColumnIds: string[];
  sortedRows: T[];
  selectedIds: string[];
  getRowId?: (row: T, index: number) => string;
  exportFilename?: string;
  title?: ReactNode;
  handleDensityChange: (density: TableDensity) => void;
  handleVisibleColumnIdsChange: (ids: string[]) => void;
  handleResetColumnVisibility: () => void;
  handleColumnOrderChange: (ids: string[]) => void;
}

/** The page's toolbar followed by density, columns and export. */
export function DataTableHeaderTools<T>({
  toolbar,
  enableDensityToggle,
  enableColumnVisibility,
  enableExport,
  density,
  orderedColumns,
  visibleColumnIds,
  sortedRows,
  selectedIds,
  getRowId,
  exportFilename,
  title,
  handleDensityChange,
  handleVisibleColumnIdsChange,
  handleResetColumnVisibility,
  handleColumnOrderChange,
}: DataTableHeaderToolsProps<T>) {
  return (
    <>
      {toolbar}
      {enableDensityToggle && (
        <RowDensityToggle density={density} onChange={handleDensityChange} />
      )}
      {enableColumnVisibility && (
        <ColumnVisibilityDropdown
          columns={orderedColumns}
          visibleColumnIds={visibleColumnIds}
          onChange={handleVisibleColumnIdsChange}
          onReset={handleResetColumnVisibility}
          onReorder={handleColumnOrderChange}
        />
      )}
      {enableExport && (
        <TableExportDropdown
          columns={orderedColumns}
          rows={sortedRows}
          selectedIds={selectedIds}
          getRowId={getRowId}
          filename={
            exportFilename ??
            (typeof title === "string"
              ? title.toLowerCase().replace(/\s+/g, "-")
              : undefined)
          }
        />
      )}
    </>
  );
}
