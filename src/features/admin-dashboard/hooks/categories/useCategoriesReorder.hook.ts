"use client";

import { useMemo, useState } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { categoriesApi } from "@/features/categories";
import type { Category } from "@/shared/api/types";

/** Owns optimistic drag-reorder state for the admin categories table, with API rollback on failure. */
export function useCategoriesReorder(
  categories: Category[],
  onRefresh?: () => void,
) {
  const [rows, setRows] = useState(categories);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Re-sync from the source list during render (React's "adjust state on prop
  // change" pattern) — an effect here would animate a stale frame first.
  const [syncedCategories, setSyncedCategories] = useState(categories);
  if (categories !== syncedCategories) {
    setSyncedCategories(categories);
    setRows(categories);
  }

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

  return { rows, ids, sensors, reorderError, onDragEnd };
}
