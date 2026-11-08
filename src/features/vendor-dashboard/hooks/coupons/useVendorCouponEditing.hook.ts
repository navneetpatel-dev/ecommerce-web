"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  toCouponUpdateBody,
  type CouponFormInput,
} from "@/features/admin-dashboard";
import { couponsApi } from "@/features/coupons";
import type { Coupon } from "@/shared/api/types";
import { ROLES } from "@/shared/constants/labels";
import { vendorCouponKeys } from "../../api/coupons/vendor-coupons.queries";

/**
 * Which vendor coupon is open for viewing or editing, and saving the edit. Only owners
 * create and change store coupons; staff can look (`canManage`).
 */
export function useVendorCouponEditing(
  vendorId: string | null,
  role?: string | null,
) {
  const queryClient = useQueryClient();
  const [detailCoupon, setDetailCoupon] = useState<Coupon | null>(null);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const saveCoupon = (values: CouponFormInput, coupon: Coupon) =>
    couponsApi
      .vendorUpdate(
        coupon.id,
        toCouponUpdateBody(values, coupon, {
          forceVendorId: vendorId ?? undefined,
        }),
      )
      .then(() => {
        void queryClient.invalidateQueries({ queryKey: vendorCouponKeys.all });
      });
  return {
    canManage: role === ROLES.VENDOR_OWNER,
    detailCoupon,
    setDetailCoupon,
    editCoupon,
    setEditCoupon,
    saveCoupon,
  };
}
