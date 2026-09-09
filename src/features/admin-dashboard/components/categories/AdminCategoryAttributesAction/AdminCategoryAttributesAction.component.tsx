"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { AttributesSortableList } from "./AttributesSortableList.component";
import { AttributeFormFields } from "./AttributeFormFields.component";
import { useAdminCategoryAttributesAction } from "../../../hooks/categories/useAdminCategoryAttributesAction.hook";
import { adminCategoryAttributesActionStyles as styles } from "../../../styles/categories/adminCategoryAttributesAction.styles";

interface AdminCategoryAttributesActionProps {
  categoryId: string;
  categoryName: string;
}

export function AdminCategoryAttributesAction({
  categoryId,
  categoryName,
}: AdminCategoryAttributesActionProps) {
  const {
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
  } = useAdminCategoryAttributesAction({ categoryId });

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("neutral")}
        onClick={handleOpen}
      >
        <SlidersHorizontal strokeWidth={2.25} aria-hidden />
        <span>{LABELS.manageAttributes}</span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>
              {LABELS.categoryAttributes} — {categoryName}
            </DialogTitle>
          </DialogHeader>
          <p className={styles.dialogDescription}>
            {LABELS.categoryAttributesHint}
          </p>

          <AttributesSortableList
            rows={rows}
            loading={loading}
            onDragEnd={onDragEnd}
            onEdit={startEdit}
            onDelete={onDelete}
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
            onSave={onSave}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
