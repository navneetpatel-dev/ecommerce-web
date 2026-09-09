"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
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

  return { rows, ids, sensors, reorderError, onDragEnd };
}
