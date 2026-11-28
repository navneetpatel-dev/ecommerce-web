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
  const applied = describeSavings(result);
  return result.replacedCodes?.length
    ? `${LABELS.couponReplacedPrevious} ${applied}`
    : applied;
}

function describeSavings(
  result: Awaited<ReturnType<typeof couponsApi.apply>>,
): string {
  if (result.discount > 0) {
    return formatLabel(LABELS.couponApplied, {
      amount: formatInr(result.discount),
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

export interface AppliedCouponNotice {
  code: string;
  text: string;
  /** The cart it was applied to. */
  signature: string;
}

/**
 * The "applied" message belongs to one coupon on one cart: it goes once the cart changes
 * or that coupon stops applying, so it can't contradict the notice below it.
 */
export function currentAppliedMessage(
  notice: AppliedCouponNotice | null,
  signature: string,
  applied: Array<{ code?: string | null }>,
  inactive: Array<{ code?: string | null }>,
): string | null {
  if (!notice || notice.signature !== signature) return null;
  const matches = (coupon: { code?: string | null }) =>
    coupon.code?.toUpperCase() === notice.code;
  return applied.some(matches) && !inactive.some(matches) ? notice.text : null;
}
