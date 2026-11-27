"use client";

import { SlidersHorizontal } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
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
      <RowActionButton
        icon={SlidersHorizontal}
        label={LABELS.manageAttributes}
        onClick={handleOpen}
      />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>
              {LABELS.categoryAttributes} — {categoryName}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className={styles.dialogDescription}>
            {LABELS.categoryAttributesHint}
          </DialogDescription>
          <p className={styles.listHint}>
            {LABELS.categoryAttributesReorderHint}
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
