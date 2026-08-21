"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import { TableCellImage } from "@/shared/components/TableCellImage";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { LABELS } from "@/shared/constants/labels";
import { CATEGORY_STATUS } from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { categoriesApi } from "@/features/categories";
import type { Category } from "@/shared/api/types";

interface CategoriesTableProps {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  pagination?: DataTablePaginationProps;
  actions?: (row: Category) => ReactNode;
}

function SortableHandle({ id }: { id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      ref={setNodeRef}
      className="h-auto min-h-0 max-h-none w-auto cursor-grab touch-none px-0 text-ink-faint hover:bg-transparent hover:text-ink active:cursor-grabbing"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
      }}
      aria-label={LABELS.dragToReorder}
      {...attributes}
      {...listeners}
      onClick={(event) => event.stopPropagation()}
    >
      <GripVertical className="h-4 w-4" />
    </Button>
  );
}

export function CategoriesTable({
  categories,
  loading = false,
  error = null,
  onRefresh,
  pagination,
  actions,
}: CategoriesTableProps) {
  const [rows, setRows] = useState(categories);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  useEffect(() => {
    setRows(categories);
  }, [categories]);

  const ids = useMemo(() => rows.map((row) => row.id), [rows]);

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(rows, oldIndex, newIndex);
    setRows(next);
    setReorderError(null);
    try {
      await categoriesApi.reorder(next.map((row) => row.id));
      onRefresh?.();
    } catch (err) {
      setRows(categories);
      setReorderError(
        getApiErrorMessage(err, LABELS.couldNotReorderCategories),
      );
    }
  };

  const columns: DataTableColumn<Category>[] = [
    {
      id: "drag",
      header: "",
      truncate: false,
      className: "w-10",
      hideOnMobile: true,
      cell: (row) => <SortableHandle id={row.id} />,
    },
    {
      id: "image",
      header: LABELS.imageUrl,
      truncate: false,
      className: "w-14",
      cell: (row) => <TableCellImage src={row.imageUrl} alt={row.name} />,
    },
    {
      id: "name",
      header: LABELS.name,
      className: "font-medium",
      accessor: "name",
    },
    {
      id: "slug",
      header: LABELS.slug,
      className: "text-ink-muted font-mono text-[0.8125rem]",
      accessor: "slug",
    },
    {
      id: "status",
      header: LABELS.status,
      truncate: false,
      cell: (row) => (
        <StatusBadge
          status={row.status || CATEGORY_STATUS.ACTIVE}
          label={
            row.status === CATEGORY_STATUS.ARCHIVED
              ? LABELS.categoryStatusArchived
              : LABELS.categoryStatusActive
          }
        />
      ),
    },
    {
      id: "parent",
      header: LABELS.parentName,
      cell: (row) => row.parent?.name || LABELS.parentCategoryNone,
    },
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <p className="mb-2 text-[0.8125rem] text-ink-muted">
          {LABELS.categoryReorderHint}
        </p>
        {reorderError ? (
          <p className="mb-2 text-[0.8125rem] text-danger">{reorderError}</p>
        ) : null}
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          error={error}
          emptyMessage={LABELS.noRecordsFound}
          onRefresh={onRefresh}
          getRowId={(row) => row.id}
          pagination={pagination}
          actions={actions}
        />
      </SortableContext>
    </DndContext>
  );
}
