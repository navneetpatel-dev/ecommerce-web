import { couponsApi } from "@/features/coupons";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

/**
 * Builds the confirmation message shown after a coupon apply succeeds
 * (pure formatting — Rule 1). Cashback coupons state the pay-now vs
 * cashback-later split; plain discounts state the saved amount.
 */
export function describeApplyResult(
  result: Awaited<ReturnType<typeof couponsApi.apply>>,
): string {
  if (result.discount > 0) {
    return formatLabel(LABELS.couponApplied, {
      amount: formatInr(Number(result.discount)),
    });
  }
  if ((result.cashbackAmount ?? 0) > 0) {
    if (result.payNowGrandTotal == null) {
      return LABELS.couponAppliedCheckout;
    }
    return formatLabel(LABELS.cashbackPayNowMessage, {
      payNow: `${formatInr(result.payNowGrandTotal)}`,
      cashback: `${formatInr(result.cashbackAmount)}`,
    });
  }
  return LABELS.couponAppliedCheckout;
}
