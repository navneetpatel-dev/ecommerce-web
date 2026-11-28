"use client";

import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { dataTableStyles } from "../../styles/data-table/dataTable.styles";
import type { DataTableProps } from "../../types/data-table/types";
import { FloatingBulkActionBar } from "./FloatingBulkActionBar.component";

interface DataTableFooterProps<T> {
  pagination?: DataTableProps<T>["pagination"];
  selectable: boolean;
  selectedIds: string[];
  totalCount: number;
  onClearSelection: () => void;
  bulkActions?: DataTableProps<T>["bulkActions"];
}

/** Page controls, and the bar of bulk actions while rows are ticked. */
export function DataTableFooter<T>({
  pagination,
  selectable,
  selectedIds,
  totalCount,
  onClearSelection,
  bulkActions,
}: DataTableFooterProps<T>) {
  return (
    <>
      {pagination != null ? (
        <div className={dataTableStyles.paginationWrapper}>
          <PaginationContainer
            currentPage={pagination.page}
            totalPages={Math.max(1, pagination.totalPages)}
            onPageChange={pagination.onPageChange}
            pageSize={pagination.pageSize}
            pageSizeOptions={pagination.pageSizeOptions}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </div>
      ) : null}

      {selectable && selectedIds.length > 0 && (
        <FloatingBulkActionBar
          selectedCount={selectedIds.length}
          totalCount={totalCount}
          onClearSelection={onClearSelection}
        >
          {typeof bulkActions === "function"
            ? bulkActions(selectedIds, onClearSelection)
            : bulkActions}
        </FloatingBulkActionBar>
      )}
    </>
  );
}
