import { couponsApi } from "@/features/coupons";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import type { Cart } from "@/shared/api/types";

/**
 * Builds the confirmation message shown after a coupon apply succeeds
 * (pure formatting — Rule 1). Cashback coupons state the pay-now vs
 * cashback-later split; plain discounts state the saved amount.
 */
export function describeApplyResult(
  result: Awaited<ReturnType<typeof couponsApi.apply>>,
  cart?: Cart | null,
): string {
  if (result.discount > 0) {
    return formatLabel(LABELS.couponApplied, {
      amount: String(result.discount),
    });
  }
  if ((result.cashbackAmount ?? 0) > 0) {
    const payNow = cart?.pricingPreview?.grandTotal ?? cart?.total ?? 0;
    return formatLabel(LABELS.cashbackPayNowMessage, {
      payNow: `₹${formatInrAmount(Number(payNow))}`,
      cashback: `₹${formatInrAmount(Number(result.cashbackAmount))}`,
    });
  }
  return LABELS.couponAppliedCheckout;
}
