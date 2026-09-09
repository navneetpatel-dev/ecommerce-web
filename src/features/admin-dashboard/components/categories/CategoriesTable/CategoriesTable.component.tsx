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
} from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import { useCategoriesReorder } from "../../../hooks/categories/useCategoriesReorder.hook";
import type { Category } from "@/shared/api/types";
import { categoriesTableStyles } from "./categoriesTable.styles";
import { useCategoriesTableColumns } from "./useCategoriesTableColumns.hook";

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
  const { rows, ids, sensors, reorderError, onDragEnd } = useCategoriesReorder(
    categories,
    onRefresh,
  );

  const columns = useCategoriesTableColumns();

  const getRowId = useCallback((row: Category) => row.id, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <p className={categoriesTableStyles.hint}>
          {LABELS.categoryReorderHint}
        </p>
        {reorderError ? (
          <p className={categoriesTableStyles.error}>{reorderError}</p>
        ) : null}
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          error={error}
          emptyMessage={LABELS.noRecordsFound}
          onRefresh={onRefresh}
          getRowId={getRowId}
          pagination={pagination}
          actions={actions}
        />
      </SortableContext>
    </DndContext>
  );
}
