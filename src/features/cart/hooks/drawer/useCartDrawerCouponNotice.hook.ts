"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useCart } from "../../api/cart/cart.queries";

/**
 * Why a coupon on the cart isn't applying, so a quantity change here is never silent.
 * Named the way the cart page names it: "₹50 off is not applied: Add ₹820.00 more…".
 */
export function useCartDrawerCouponNotice() {
  const { data: cart } = useCart();
  const inactive = cart?.inactiveCoupons?.[0];
  if (!inactive) return null;
  return formatLabel(LABELS.couponNotAppliedLine, {
    name: inactive.name,
    reason: inactive.reason,
  });
}
