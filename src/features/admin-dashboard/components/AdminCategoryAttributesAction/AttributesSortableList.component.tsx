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
import { SortableAttributeRow } from "./SortableAttributeRow.component";

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-line p-3">
          {rows.length === 0 ? (
            <li className="text-[0.875rem] text-ink-muted">
              {LABELS.noRecordsFound}
            </li>
          ) : (
            rows.map((row) => (
              <SortableAttributeRow
                key={row.id}
                row={row}
                disabled={loading}
                onEdit={() => onEdit(row)}
                onDelete={() => onDelete(row.id)}
              />
            ))
          )}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
