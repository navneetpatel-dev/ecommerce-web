/** Fixed value sets shared by the coupon form schemas (Rule 8 enums). */
export const COUPON_TYPES = [
  "PERCENTAGE",
  "FLAT",
  "FREE_SHIPPING",
  "BOGO",
  "TIERED",
  "CASHBACK",
  "BUNDLE",
] as const;

export const SCOPE_TYPES = ["all", "vendor", "product", "category"] as const;

export const USER_RESTRICTION_TYPES = [
  "all",
  "firstOrder",
  "specific",
  "segment",
] as const;

export const TYPES_REQUIRING_VALUE = new Set<(typeof COUPON_TYPES)[number]>([
  "PERCENTAGE",
  "FLAT",
  "CASHBACK",
  "BUNDLE",
]);
