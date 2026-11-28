"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CouponSchema,
  VENDOR_COUPON_FORM_DEFAULTS,
  type CouponFormInput,
} from "@/features/admin-dashboard";
import { useRouteQueryDialog } from "@/shared/hooks/navigation/useRouteQueryDialog.hook";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";
import { LABELS } from "@/shared/constants/labels";
import { useCreateVendorCoupon } from "../../api/coupons/vendor-coupons.queries";

const emptyForm = (vendorId: string | null) => ({
  ...VENDOR_COUPON_FORM_DEFAULTS,
  applicableScopeIds: vendorId ? [vendorId] : [],
});

/** The create-coupon dialog of the vendor page: its form, errors and submission. */
export function useVendorCouponCreate(vendorId: string | null) {
  const dialog = useRouteQueryDialog();
  const createMutation = useCreateVendorCoupon(vendorId);

  const form = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: emptyForm(vendorId),
  });

  useUnsavedChanges(form.formState.isDirty);

  const { formLevelError } = useApiFormErrors(
    form,
    createMutation.error,
    LABELS.couldNotCreateCoupon,
  );

  useEffect(() => {
    if (!vendorId) return;
    if (form.getValues("applicableScopeType") !== "vendor") return;
    if (form.getValues("applicableScopeIds").length > 0) return;
    form.setValue("applicableScopeIds", [vendorId]);
  }, [vendorId, form]);

  const prevCreateOpenRef = useRef(false);

  useEffect(() => {
    if (dialog.open && !prevCreateOpenRef.current) {
      form.reset(emptyForm(vendorId));
      createMutation.reset();
    }
    prevCreateOpenRef.current = dialog.open;
  }, [dialog.open, vendorId, form, createMutation]);

  const setOpen = (next: boolean) => {
    if (next) {
      dialog.openCreate();
      return;
    }
    dialog.close();
  };

  const onSubmit = (values: CouponFormInput) => {
    createMutation.mutate(values, {
      onSuccess: () => dialog.close(),
    });
  };

  return {
    open: dialog.open,
    setOpen,
    form,
    isPending: createMutation.isPending,
    formLevelError,
    onSubmit,
    setQuery: dialog.setQuery,
  };
}
