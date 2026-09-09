"use client";

import { useEffect, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { LABELS } from "@/shared/constants/labels";
import { CATEGORY_ATTRIBUTE_TYPE } from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { categoriesApi } from "@/features/categories";
import type { CategoryAttribute } from "@/shared/api/types";
import { optionsToInput, parseOptions } from "./attributeOptionUtils";

interface UseAdminCategoryAttributesActionParams {
  categoryId: string;
}

export function useAdminCategoryAttributesAction({
  categoryId,
}: UseAdminCategoryAttributesActionParams) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<CategoryAttribute[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<string>(CATEGORY_ATTRIBUTE_TYPE.ENUM);
  const [options, setOptions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setType(CATEGORY_ATTRIBUTE_TYPE.ENUM);
    setOptions("");
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await categoriesApi.listAttributes(categoryId));
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadData));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      resetForm();
      void load();
    }
  }, [open, categoryId]);

  const onSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const body = {
        name: name.trim(),
        type,
        options: parseOptions(type, options),
      };
      if (editingId) {
        await categoriesApi.updateAttribute(categoryId, editingId, body);
      } else {
        await categoriesApi.createAttribute(categoryId, body);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveAttribute));
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (attributeId: string) => {
    setLoading(true);
    setError(null);
    try {
      await categoriesApi.deleteAttribute(categoryId, attributeId);
      if (editingId === attributeId) resetForm();
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotDeleteAttribute));
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(rows, oldIndex, newIndex);
    setRows(next);
    setError(null);
    try {
      await categoriesApi.reorderAttributes(
        categoryId,
        next.map((row) => row.id),
      );
    } catch (err) {
      setRows(rows);
      setError(getApiErrorMessage(err, LABELS.couldNotReorderAttributes));
    }
  };

  const startEdit = (row: CategoryAttribute) => {
    setEditingId(row.id);
    setName(row.name);
    setType(row.type);
    setOptions(optionsToInput(row.options));
  };

  const handleOpen = () => setOpen(true);
  const handleOpenChange = (next: boolean) => setOpen(next);

  return {
    open,
    rows,
    editingId,
    name,
    setName,
    type,
    setType,
    options,
    setOptions,
    error,
    loading,
    resetForm,
    onSave,
    onDelete,
    onDragEnd,
    startEdit,
    handleOpen,
    handleOpenChange,
  };
}
