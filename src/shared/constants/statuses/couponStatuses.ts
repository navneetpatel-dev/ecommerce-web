/** Coupon / discount enums — keep values identical to backend Sequelize ENUMs. */

export const COUPON_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  EXPIRED: "EXPIRED",
  ARCHIVED: "ARCHIVED",
  REJECTED: "REJECTED",
} as const;
export type CouponStatusValue =
  (typeof COUPON_STATUS)[keyof typeof COUPON_STATUS];
export const COUPON_STATUS_VALUES = Object.values(COUPON_STATUS) as [
  CouponStatusValue,
  ...CouponStatusValue[],
];

export const DISCOUNT_BEARER = {
  PLATFORM: "PLATFORM",
  VENDOR: "VENDOR",
} as const;
export type DiscountBearerValue =
  (typeof DISCOUNT_BEARER)[keyof typeof DISCOUNT_BEARER];
export const DISCOUNT_BEARER_VALUES = Object.values(DISCOUNT_BEARER) as [
  DiscountBearerValue,
  ...DiscountBearerValue[],
];

export const COUPON_USER_SEGMENT = {
  NEW: "new",
  RETURNING: "returning",
  LOYAL: "loyal",
} as const;
export type CouponUserSegmentValue =
  (typeof COUPON_USER_SEGMENT)[keyof typeof COUPON_USER_SEGMENT];
export const COUPON_USER_SEGMENT_VALUES = Object.values(
  COUPON_USER_SEGMENT,
) as [CouponUserSegmentValue, ...CouponUserSegmentValue[]];
