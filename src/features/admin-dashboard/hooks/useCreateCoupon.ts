import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminApi } from "../api/admin.api";
import { adminKeys } from "../api/admin.queries";
import {
  CouponSchema,
  COUPON_FORM_DEFAULTS,
  toCouponCreateBody,
  type CouponFormInput,
} from "../schemas/coupons.schema";

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: COUPON_FORM_DEFAULTS,
  });

  const createCoupon = useMutation({
    mutationFn: (body: CouponFormInput) =>
      adminApi.createCoupon(toCouponCreateBody(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.coupons.all });
      form.reset(COUPON_FORM_DEFAULTS);
      setOpen(false);
    },
  });

  const setDialogOpen = (next: boolean) => {
    setOpen(next);
    if (!next) {
      form.reset(COUPON_FORM_DEFAULTS);
      createCoupon.reset();
    }
  };

  return { open, setOpen: setDialogOpen, createCoupon, form };
}
