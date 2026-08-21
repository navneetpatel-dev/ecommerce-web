"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { CategoryAttribute } from "@/shared/api/types";

interface SortableAttributeRowProps {
  row: CategoryAttribute;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableAttributeRow({
  row,
  disabled,
  onEdit,
  onDelete,
}: SortableAttributeRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
  });

  return (
    <li
      ref={setNodeRef}
      className="flex items-center justify-between gap-2 text-[0.875rem]"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-auto min-h-0 max-h-none w-auto cursor-grab touch-none px-0 text-ink-faint hover:bg-transparent hover:text-ink active:cursor-grabbing"
          aria-label={LABELS.dragToReorder}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <span className="truncate">
          {row.name} <span className="text-ink-muted">({row.type})</span>
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          disabled={disabled}
          onClick={onEdit}
          aria-label={LABELS.editCategoryAttribute}
        >
          <Pencil className="h-4 w-4" aria-hidden />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-danger"
          disabled={disabled}
          onClick={onDelete}
          aria-label={LABELS.deleteCategoryAttribute}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </li>
  );
}
