import type { Cart } from "@/shared/api/types";

/**
 * The coupons to price with: whatever applies on the cart right now, the only source of
 * truth. Sent even when empty, so a coupon that just stopped working can't block checkout.
 * Undefined until the cart has loaded: the backend then uses the cart's own.
 */
export function resolveCheckoutCouponCodes(
  cart: Pick<Cart, "appliedCoupons"> | undefined,
): string[] | undefined {
  if (!cart) return undefined;
  return (cart.appliedCoupons ?? []).map((coupon) => coupon.code);
}
