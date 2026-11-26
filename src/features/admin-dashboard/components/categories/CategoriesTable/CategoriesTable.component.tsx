"use client";

import { useCallback, type ReactNode } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DataTable,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import { categoriesApi } from "@/features/categories";
import { useCategoriesReorder } from "../../../hooks/categories/useCategoriesReorder.hook";
import type { Category } from "@/shared/api/types";
import { categoriesTableStyles } from "../../../styles/categories/categoriesTable.styles";
import { useCategoriesTableColumns } from "../../../hooks/categories/useCategoriesTableColumns.hook";
import { CategoriesFilters } from "../CategoriesFilters.component";

export interface CategoriesFilterState {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

export interface CategoriesTableProps {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  pagination?: DataTablePaginationProps;
  actions?: (row: Category) => ReactNode;
  filters: CategoriesFilterState;
}

export function CategoriesTable({
  categories,
  loading = false,
  error = null,
  onRefresh,
  pagination,
  actions,
  filters,
}: CategoriesTableProps) {
  const hasFilters = Boolean(filters.search.trim() || filters.status);

  const { rows, ids, sensors, reorderError, onDragEnd } = useCategoriesReorder(
    categories,
    onRefresh,
  );

  const columns = useCategoriesTableColumns();

  const getRowId = useCallback((row: Category) => row.id, []);

  const fetchRowDetail = useCallback(
    async (row: Category) =>
      (await categoriesApi.adminDetail(row.id)) as unknown as Record<
        string,
        unknown
      >,
    [],
  );

  return (
    <div>
      <CategoriesFilters
        search={filters.search}
        status={filters.status}
        onSearchChange={filters.onSearchChange}
        onStatusChange={filters.onStatusChange}
        onClear={filters.onClear}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <p className={categoriesTableStyles.hint}>
            {hasFilters ? LABELS.categoryOrderHint : LABELS.categoryReorderHint}
          </p>
          {reorderError ? (
            <p role="alert" className={categoriesTableStyles.error}>
              {reorderError}
            </p>
          ) : null}
          <DataTable
            ariaLabel={LABELS.categoriesTableAria}
            columns={columns}
            rows={rows}
            loading={loading}
            error={error}
            emptyMessage={LABELS.noRecordsFound}
            onRefresh={onRefresh}
            getRowId={getRowId}
            pagination={pagination}
            actions={actions}
            fetchRowDetail={fetchRowDetail}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}
