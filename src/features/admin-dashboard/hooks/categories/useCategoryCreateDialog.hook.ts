"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS } from "@/shared/constants/labels";
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";
import { useDiscardChangesGuard } from "@/shared/hooks/dialogs/useDiscardChangesGuard.hook";
import {
  applyApiErrorsToForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import { categoriesApi } from "@/features/categories";
import {
  CATEGORY_FORM_DEFAULTS,
  CategoryFormSchema,
  toCategoryCreateBody,
  type CategoryFormInput,
} from "../../schemas/categories/categories.schema";

/** The "create category" dialog: its form, saving, and the discard confirmation. */
export function useCategoryCreateDialog(onCreated: () => void) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(CategoryFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: CATEGORY_FORM_DEFAULTS,
  });

  useUnsavedChanges(form.formState.isDirty);

  const onSubmit = useCallback(
    async (data: CategoryFormInput) => {
      setIsPending(true);
      setCreateError(null);
      try {
        await categoriesApi.create(toCategoryCreateBody(data));
        form.reset(CATEGORY_FORM_DEFAULTS);
        setOpen(false);
        onCreated();
      } catch (err) {
        const mapped = applyApiErrorsToForm(form, err);
        setCreateError(
          mapped
            ? null
            : getFormLevelApiError(err, LABELS.couldNotSaveCategories),
        );
      } finally {
        setIsPending(false);
      }
    },
    [form, onCreated],
  );

  const setDialogOpen = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        setCreateError(null);
        form.reset(CATEGORY_FORM_DEFAULTS);
      }
    },
    [form],
  );

  // Dirty dismissal asks for confirmation; the post-save close calls setOpen.
  const discard = useDiscardChangesGuard(form.formState.isDirty);
  const handleDialogOpenChange = (next: boolean) => {
    if (next) setDialogOpen(true);
    else discard.requestClose(() => setDialogOpen(false));
  };

  return {
    open,
    setOpen: setDialogOpen,
    handleDialogOpenChange,
    discardOpen: discard.confirmOpen,
    handleDiscardOpenChange: discard.handleConfirmOpenChange,
    confirmDiscard: discard.confirmDiscard,
    cancelDiscard: discard.cancelDiscard,
    form,
    isPending,
    createError,
    onSubmit,
  };
}
