"use client";

import { useEffect, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { CATEGORY_ATTRIBUTE_TYPE } from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { categoriesApi } from "@/features/categories";
import type { CategoryAttribute } from "@/shared/api/types";
import { AttributesSortableList } from "./AttributesSortableList";
import { AttributeFormFields } from "./AttributeFormFields";
import { optionsToInput, parseOptions } from "./attributeOptionUtils";

interface AdminCategoryAttributesActionProps {
  categoryId: string;
  categoryName: string;
}

export function AdminCategoryAttributesAction({
  categoryId,
  categoryName,
}: AdminCategoryAttributesActionProps) {
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

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("neutral")}
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal strokeWidth={2.25} aria-hidden />
        <span>{LABELS.manageAttributes}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(92vh,48rem)] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {LABELS.categoryAttributes} — {categoryName}
            </DialogTitle>
          </DialogHeader>
          <p className="text-[0.875rem] text-ink-muted">
            {LABELS.categoryAttributesHint}
          </p>

          <AttributesSortableList
            rows={rows}
            loading={loading}
            onDragEnd={(event) => void onDragEnd(event)}
            onEdit={startEdit}
            onDelete={(attributeId) => void onDelete(attributeId)}
          />

          <AttributeFormFields
            name={name}
            onNameChange={setName}
            type={type}
            onTypeChange={setType}
            options={options}
            onOptionsChange={setOptions}
            editingId={editingId}
            error={error}
            loading={loading}
            onReset={resetForm}
            onSave={() => void onSave()}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
