"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormActions } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { AdminCategoryFormFields } from "./AdminCategoryFormFields.component";
import { useAdminEditCategoryAction } from "../../hooks/categories/useAdminEditCategoryAction.hook";
import { adminEditCategoryActionStyles as styles } from "../../styles/categories/adminEditCategoryAction.styles";

interface AdminEditCategoryActionProps {
  category: {
    id: string;
    name: string;
    parentId?: string | null;
    imageUrl?: string | null;
    status?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    commissionRate?: number | null;
    returnWindowDays?: number | null;
    codEnabled?: boolean;
    defaultWarrantyMonths?: number | null;
    defaultWarrantyType?: string | null;
  };
  onSaved: () => void;
}

export function AdminEditCategoryAction({
  category,
  onSaved,
}: AdminEditCategoryActionProps) {
  const {
    open,
    isPending,
    error,
    form,
    canSubmit,
    openEditor,
    closeEditor,
    handleOpenChange,
    onSubmit,
  } = useAdminEditCategoryAction({ category, onSaved });

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("edit")}
        disabled={isPending}
        onClick={openEditor}
      >
        <Pencil strokeWidth={2.25} aria-hidden />
        <span>{LABELS.edit}</span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>{LABELS.editCategoryTitle}</DialogTitle>
          </DialogHeader>
          <p className={styles.dialogDescription}>{LABELS.editCategoryBody}</p>
          <form onSubmit={onSubmit} className={styles.form}>
            <AdminCategoryFormFields
              form={form}
              excludeCategoryId={category.id}
              idPrefix={`category-edit-${category.id}`}
            />
            {error ? <p className={styles.errorMessage}>{error}</p> : null}
            <FormActions>
              <Button
                type="button"
                variant="secondary"
                onClick={closeEditor}
                disabled={isPending}
              >
                {LABELS.cancel}
              </Button>
              <DisabledActionHint
                disabled={!canSubmit || isPending}
                message={LABELS.enterCategoryNameToSave}
              >
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {LABELS.save}
                </Button>
              </DisabledActionHint>
            </FormActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
