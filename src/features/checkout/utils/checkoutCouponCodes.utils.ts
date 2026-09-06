import type { Cart } from "@/shared/api/types";

/**
 * Full stacked-coupon code set to send with a quote/place-order call.
 * Prefers the cart's stacked `appliedCoupons`; falls back to the single
 * manually-typed code from the checkout store when the cart has none.
 */
export function resolveCheckoutCouponCodes(
  cart: Pick<Cart, "appliedCoupons"> | undefined,
  appliedCouponCode: string | null,
): string[] | undefined {
  if (cart?.appliedCoupons?.length) {
    return cart.appliedCoupons.map((c) => c.code);
  }
  return appliedCouponCode ? [appliedCouponCode] : undefined;
}
