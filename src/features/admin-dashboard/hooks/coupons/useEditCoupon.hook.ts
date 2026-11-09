"use client";

import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Coupon } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  CouponSchema,
  couponLockedFields,
  couponToFormValues,
  toCouponCreateBody,
  type CouponFormInput,
} from "../../schemas/coupons/coupons.schema";

export interface UseEditCouponArgs {
  coupon: Coupon;
  /** Sends the PATCH (admin or vendor endpoint). */
  save: (couponId: string, body: unknown) => Promise<unknown>;
  /** Query to refresh after a save (the table the coupon came from). */
  invalidateKey: readonly unknown[];
  /** Vendor edits keep the coupon on the vendor and vendor-borne. */
  forceVendorId?: string | null;
}

/** Edit dialog state for one coupon: prefilled form, locked fields once used, save. */
export function useEditCoupon({
  coupon,
  save,
  invalidateKey,
  forceVendorId = null,
}: UseEditCouponArgs) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: couponToFormValues(coupon),
  });

  useUnsavedChanges(open && form.formState.isDirty);

  const mutation = useMutation({
    mutationFn: (values: CouponFormInput) =>
      save(
        coupon.id,
        toCouponCreateBody(
          values,
          forceVendorId ? { forceVendorId } : undefined,
        ),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invalidateKey });
      notifySuccess(LABELS.couponUpdated);
      setOpen(false);
    },
  });

  const { formLevelError } = useApiFormErrors(
    form,
    mutation.error,
    LABELS.couldNotUpdateCoupon,
  );

  const setDialogOpen = useCallback(
    (next: boolean) => {
      if (next) form.reset(couponToFormValues(coupon));
      else mutation.reset();
      setOpen(next);
    },
    [coupon, form, mutation],
  );

  const handleOpen = useCallback(() => setDialogOpen(true), [setDialogOpen]);
  const lockedFields = couponLockedFields(coupon);

  return {
    open,
    setOpen: setDialogOpen,
    handleOpen,
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isPending: mutation.isPending,
    formLevelError,
    lockedFields,
    lockedHint: lockedFields.length
      ? formatLabel(LABELS.couponLockedAfterUse, { count: coupon.usedCount })
      : null,
    title: formatLabel(LABELS.editCouponTitle, { code: coupon.code }),
  };
}
