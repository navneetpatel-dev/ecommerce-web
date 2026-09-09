"use client";

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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LABELS } from "@/shared/constants/labels";
import type { CategoryAttribute } from "@/shared/api/types";
import { AttributesSortableRows } from "./AttributesSortableRows.component";
import { adminCategoryAttributesActionStyles as styles } from "./adminCategoryAttributesAction.styles";

interface AttributesSortableListProps {
  rows: CategoryAttribute[];
  loading: boolean;
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (row: CategoryAttribute) => void;
  onDelete: (attributeId: string) => void;
}

export function AttributesSortableList({
  rows,
  loading,
  onDragEnd,
  onEdit,
  onDelete,
}: AttributesSortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const ids = rows.map((row) => row.id);
  const isEmpty = rows.length === 0;

  const emptyRow = <li className={styles.emptyRow}>{LABELS.noRecordsFound}</li>;

  const listContent = isEmpty ? (
    emptyRow
  ) : (
    <AttributesSortableRows
      rows={rows}
      disabled={loading}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className={styles.listContainer}>{listContent}</ul>
      </SortableContext>
    </DndContext>
  );
}
