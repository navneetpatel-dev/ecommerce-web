interface AppliedCouponLike {
  code: string;
  cashbackAmount?: number;
  type?: string;
}

/**
 * The applied coupon's code only when that coupon itself gives cashback (B-58). A flat
 * coupon such as FIRST100 used to be labelled "Cashback offer" whenever a platform
 * cashback offer applied to the same order.
 */
export function cashbackCouponCode(
  coupon: AppliedCouponLike | null | undefined,
): string | undefined {
  if (!coupon) return undefined;
  const givesCashback =
    coupon.type === "CASHBACK" || (coupon.cashbackAmount ?? 0) > 0;
  return givesCashback ? coupon.code : undefined;
}
