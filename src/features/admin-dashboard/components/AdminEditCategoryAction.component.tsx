"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  CATEGORY_STATUS,
  type CategoryStatus,
} from "@/shared/constants/statuses";
import {
  applyApiErrorsToForm,
  getFormLevelApiError,
} from "@/shared/utils/applyApiFormErrors";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import {
  CategoryFormSchema,
  toCategoryUpdateBody,
  type CategoryFormInput,
} from "../schemas/categories.schema";
import { AdminCategoryFormFields } from "./AdminCategoryFormFields.component";
import { categoriesApi } from "@/features/categories";

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
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(CategoryFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: category.name,
      parentId: category.parentId ?? "",
      imageUrl: category.imageUrl ?? "",
      status:
        category.status === CATEGORY_STATUS.ARCHIVED
          ? CATEGORY_STATUS.ARCHIVED
          : CATEGORY_STATUS.ACTIVE,
      seoTitle: "",
      seoDescription: "",
      commissionRate: "",
      returnWindowDays: "",
      codEnabled: true,
      defaultWarrantyMonths: "",
      defaultWarrantyType: "",
    },
  });

  const values = form.watch();
  const canSubmit = CategoryFormSchema.safeParse(values).success;

  const openEditor = () => {
    setError(null);
    form.reset({
      name: category.name,
      parentId: category.parentId ?? "",
      imageUrl: category.imageUrl ?? "",
      status: (category.status as CategoryStatus) || CATEGORY_STATUS.ACTIVE,
      seoTitle: category.seoTitle ?? "",
      seoDescription: category.seoDescription ?? "",
      commissionRate:
        category.commissionRate != null && category.commissionRate !== undefined
          ? String(category.commissionRate)
          : "",
      returnWindowDays:
        category.returnWindowDays != null
          ? String(category.returnWindowDays)
          : "",
      codEnabled: category.codEnabled !== false,
      defaultWarrantyMonths:
        category.defaultWarrantyMonths != null
          ? String(category.defaultWarrantyMonths)
          : "",
      defaultWarrantyType: category.defaultWarrantyType ?? "",
    });
    setOpen(true);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsPending(true);
    setError(null);
    try {
      await categoriesApi.update(category.id, toCategoryUpdateBody(data));
      setOpen(false);
      onSaved();
    } catch (err) {
      const mapped = applyApiErrorsToForm(form, err);
      setError(
        mapped
          ? null
          : getFormLevelApiError(err, LABELS.couldNotSaveCategories),
      );
    } finally {
      setIsPending(false);
    }
  });

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

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setError(null);
            form.clearErrors();
          }
        }}
      >
        <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{LABELS.editCategoryTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-[0.875rem] text-ink-muted">
            {LABELS.editCategoryBody}
          </p>
          <form onSubmit={onSubmit} className="space-y-6">
            <AdminCategoryFormFields
              form={form}
              excludeCategoryId={category.id}
              idPrefix={`category-edit-${category.id}`}
            />
            {error ? <p className="text-body-sm text-danger">{error}</p> : null}
            <FormActions>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
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
