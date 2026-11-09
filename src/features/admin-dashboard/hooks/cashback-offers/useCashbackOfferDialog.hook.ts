"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveCashbackOffer, type CashbackOffer } from "@/features/cashback";
import { LABELS } from "@/shared/constants/labels";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import {
  CashbackOfferFormSchema,
  cashbackOfferToFormValues,
  toCashbackOfferInput,
  type CashbackOfferFormValues,
} from "../../schemas/cashback-offers/cashbackOfferForm.schema";

/** Create (no offer) or edit dialog: prefilled form, save, unsaved-changes guard. */
export function useCashbackOfferDialog(offer: CashbackOffer | null) {
  const [open, setOpen] = useState(false);
  const save = useSaveCashbackOffer();
  const form = useForm<CashbackOfferFormValues>({
    resolver: zodResolver(CashbackOfferFormSchema),
    mode: "onTouched",
    defaultValues: cashbackOfferToFormValues(offer),
  });

  useUnsavedChanges(open && form.formState.isDirty);
  const { formLevelError } = useApiFormErrors(
    form,
    save.error,
    LABELS.genericActionFailed,
  );

  const setDialogOpen = useCallback(
    (next: boolean) => {
      if (next) form.reset(cashbackOfferToFormValues(offer));
      else save.reset();
      setOpen(next);
    },
    [form, offer, save],
  );

  const handleOpen = useCallback(() => setDialogOpen(true), [setDialogOpen]);

  const onSubmit = form.handleSubmit((values) =>
    save.mutate(
      { id: offer?.id, values: toCashbackOfferInput(values) },
      {
        onSuccess: () => {
          notifySuccess(LABELS.cashbackOfferSaved);
          setOpen(false);
        },
      },
    ),
  );

  return {
    open,
    setOpen: setDialogOpen,
    handleOpen,
    form,
    onSubmit,
    isPending: save.isPending,
    formLevelError,
    title: offer
      ? LABELS.cashbackOfferEditTitle
      : LABELS.cashbackOfferCreateTitle,
  };
}
