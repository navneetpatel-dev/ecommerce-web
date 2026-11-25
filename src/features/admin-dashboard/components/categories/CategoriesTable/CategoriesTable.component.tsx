"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import { useUrlFilterParams } from "@/shared/hooks/navigation/useUrlFilterParams.hook";
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

export interface CategoriesTableProps {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  pagination?: DataTablePaginationProps;
  actions?: (row: Category) => ReactNode;
}

export function CategoriesTable({
  categories,
  loading = false,
  error = null,
  onRefresh,
  pagination,
  actions,
}: CategoriesTableProps) {
  const urlFilters = useUrlFilterParams<"search" | "status">({ search: ["q"] });
  const search = urlFilters.get("search");
  const status = urlFilters.get("status");

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const match =
          cat.name?.toLowerCase().includes(q) ||
          cat.slug?.toLowerCase().includes(q) ||
          cat.seoDescription?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (status === "active" && cat.status !== "ACTIVE") return false;
      if (status === "inactive" && cat.status === "ACTIVE") return false;
      return true;
    });
  }, [categories, search, status]);

  const { rows, ids, sensors, reorderError, onDragEnd } = useCategoriesReorder(
    filteredCategories,
    onRefresh,
  );

  const columns = useCategoriesTableColumns();

  const getRowId = useCallback((row: Category) => row.id, []);

  const fetchRowDetail = useCallback(
    async (row: Category) =>
      (await categoriesApi.detail(row.id)) as unknown as Record<
        string,
        unknown
      >,
    [],
  );

  const hasFilters = Boolean(search || status);

  return (
    <div>
      <CategoriesFilters
        search={search}
        status={status}
        onSearchChange={urlFilters.set("search")}
        onStatusChange={urlFilters.set("status")}
        onClear={() => urlFilters.clearAll(["search", "status"])}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <p className={categoriesTableStyles.hint}>
            {hasFilters
              ? "Filtering categories by search/status. Clear filters to reorder."
              : LABELS.categoryReorderHint}
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
