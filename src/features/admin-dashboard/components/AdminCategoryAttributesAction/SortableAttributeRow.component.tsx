"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { CategoryAttribute } from "@/shared/api/types";
import { adminCategoryAttributesActionStyles } from "./adminCategoryAttributesAction.styles";

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
  const rowOpacity = isDragging ? 0.6 : 1;
  const rowStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: rowOpacity,
  };

  return (
    <li
      ref={setNodeRef}
      className={adminCategoryAttributesActionStyles.rowContainer}
      style={rowStyle}
    >
      <div className={adminCategoryAttributesActionStyles.rowLeft}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={adminCategoryAttributesActionStyles.dragHandle}
          aria-label={LABELS.dragToReorder}
          {...attributes}
          {...listeners}
        >
          <GripVertical
            className={adminCategoryAttributesActionStyles.iconSize}
          />
        </Button>
        <span className={adminCategoryAttributesActionStyles.rowLabel}>
          {row.name}{" "}
          <span className={adminCategoryAttributesActionStyles.rowType}>
            ({row.type})
          </span>
        </span>
      </div>
      <div className={adminCategoryAttributesActionStyles.rowActions}>
        <Button
          size="sm"
          variant="ghost"
          disabled={disabled}
          onClick={onEdit}
          aria-label={LABELS.editCategoryAttribute}
        >
          <Pencil
            className={adminCategoryAttributesActionStyles.iconSize}
            aria-hidden
          />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={adminCategoryAttributesActionStyles.btnDanger}
          disabled={disabled}
          onClick={onDelete}
          aria-label={LABELS.deleteCategoryAttribute}
        >
          <Trash2
            className={adminCategoryAttributesActionStyles.iconSize}
            aria-hidden
          />
        </Button>
      </div>
    </li>
  );
}
