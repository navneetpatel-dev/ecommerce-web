"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS } from "@/shared/constants/labels";
import {
  applyApiErrorsToForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import {
  CategoryFormSchema,
  toCategoryUpdateBody,
  type CategoryFormInput,
} from "../../schemas/categories/categories.schema";
import {
  categoryFormValues,
  type CategoryData,
} from "../../utils/categories/categoryFormValues";
import { categoriesApi } from "@/features/categories";
import { useCategoryRateImpact } from "./useCategoryRateImpact.hook";
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";

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
    defaultValues: categoryFormValues(category),
  });

  useUnsavedChanges(form.formState.isDirty);

  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form watch() is compiler-incompatible; used directly in render.
  const values = form.watch();
  // A new parent can change the GST and commission of the products below this category.
  const reparented =
    open && (values.parentId ?? "") !== (category.parentId ?? "");
  const rates = useCategoryRateImpact(
    reparented
      ? {
          kind: "reparent",
          categoryId: category.id,
          parentId: values.parentId || undefined,
        }
      : null,
  );
  const canSubmit =
    CategoryFormSchema.safeParse(values).success &&
    !rates.checking &&
    !rates.blocked;

  const openEditor = () => {
    setError(null);
    form.reset(categoryFormValues(category));
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
    const changeReason = rates.takeReason();
    if (changeReason === null) return;
    setIsPending(true);
    setError(null);
    try {
      await categoriesApi.update(category.id, {
        ...toCategoryUpdateBody(data),
        changeReason,
      });
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
    rates,
    openEditor,
    closeEditor,
    handleOpenChange,
    onSubmit,
  };
}
