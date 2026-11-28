"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LABELS } from "@/shared/constants/labels";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Coupon } from "@/shared/api/types";
import {
  CouponEditSchema,
  FORM_TIERS,
  toCouponFormValues,
  type CouponFormInput,
} from "../../schemas/coupons/coupons.schema";

/** The edit form for one coupon. Where it saves differs for admins and vendors. */
export function useEditCoupon(
  coupon: Coupon,
  save: (values: CouponFormInput, coupon: Coupon) => Promise<unknown>,
  onSaved: () => void,
) {
  const form = useForm<CouponFormInput>({
    resolver: zodResolver(CouponEditSchema),
    mode: "onTouched",
    defaultValues: toCouponFormValues(coupon),
  });
  const mutation = useMutation({
    mutationFn: (values: CouponFormInput) => save(values, coupon),
    onSuccess: onSaved,
  });
  const { formLevelError } = useApiFormErrors(
    form,
    mutation.error,
    LABELS.couldNotSaveCoupon,
  );
  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));
  const tierCount =
    coupon.type === "TIERED" ? (coupon.config?.tiers?.length ?? 0) : 0;
  /** Says so when the coupon has tiers this form doesn't show. */
  const keptTiersNote =
    tierCount > FORM_TIERS
      ? formatLabel(LABELS.couponKeptTiers, { count: tierCount })
      : null;
  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    formLevelError,
    keptTiersNote,
  };
}
