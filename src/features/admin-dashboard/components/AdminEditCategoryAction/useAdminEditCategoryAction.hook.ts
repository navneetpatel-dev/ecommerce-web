"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS } from "@/shared/constants/labels";
import {
  CATEGORY_STATUS,
  type CategoryStatus,
} from "@/shared/constants/statuses";
import {
  applyApiErrorsToForm,
  getFormLevelApiError,
} from "@/shared/utils/applyApiFormErrors";
import {
  CategoryFormSchema,
  toCategoryUpdateBody,
  type CategoryFormInput,
} from "../../schemas/categories.schema";
import { categoriesApi } from "@/features/categories";

interface CategoryData {
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
}

interface UseAdminEditCategoryActionParams {
  category: CategoryData;
  onSaved: () => void;
}

export function useAdminEditCategoryAction({
  category,
  onSaved,
}: UseAdminEditCategoryActionParams) {
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

  const closeEditor = () => {
    setOpen(false);
    setError(null);
    form.clearErrors();
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setError(null);
      form.clearErrors();
    }
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

  return {
    open,
    isPending,
    error,
    form,
    canSubmit,
    openEditor,
    closeEditor,
    handleOpenChange,
    onSubmit,
  };
}
