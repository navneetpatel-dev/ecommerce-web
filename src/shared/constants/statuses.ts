/** Domain status / method enums — keep values identical to backend Sequelize ENUMs. */

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
} as const
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export const PRODUCT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  LIVE: 'LIVE',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED',
} as const
export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS]

export const VENDOR_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const
export type VendorStatus = (typeof VENDOR_STATUS)[keyof typeof VENDOR_STATUS]

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
} as const
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]

export const REVIEW_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS]

export const RETURN_STATUS = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PICKUP_SCHEDULED: 'PICKUP_SCHEDULED',
  RECEIVED: 'RECEIVED',
  REFUNDED: 'REFUNDED',
  CLOSED: 'CLOSED',
} as const
export type ReturnStatus = (typeof RETURN_STATUS)[keyof typeof RETURN_STATUS]

export const RETURN_REASON = {
  DAMAGED: 'DAMAGED',
  WRONG_ITEM: 'WRONG_ITEM',
  NOT_AS_DESCRIBED: 'NOT_AS_DESCRIBED',
  NO_LONGER_NEEDED: 'NO_LONGER_NEEDED',
  OTHER: 'OTHER',
} as const
export type ReturnReason = (typeof RETURN_REASON)[keyof typeof RETURN_REASON]
export const RETURN_REASON_VALUES = Object.values(RETURN_REASON) as [
  ReturnReason,
  ...ReturnReason[],
]

export const SHIPMENT_STATUS = {
  PENDING: 'PENDING',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
} as const
export type ShipmentStatus = (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS]

export const SHIPPING_METHOD = {
  STANDARD: 'STANDARD',
  EXPRESS: 'EXPRESS',
} as const
export type ShippingMethod = (typeof SHIPPING_METHOD)[keyof typeof SHIPPING_METHOD]

export const PAYMENT_METHOD = {
  RAZORPAY: 'RAZORPAY',
  COD: 'COD',
} as const
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export const COUPON_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
  ARCHIVED: 'ARCHIVED',
} as const
export type CouponStatusValue = (typeof COUPON_STATUS)[keyof typeof COUPON_STATUS]
export const COUPON_STATUS_VALUES = Object.values(COUPON_STATUS) as [
  CouponStatusValue,
  ...CouponStatusValue[],
]

export const DISCOUNT_BEARER = {
  PLATFORM: 'PLATFORM',
  VENDOR: 'VENDOR',
} as const
export type DiscountBearerValue = (typeof DISCOUNT_BEARER)[keyof typeof DISCOUNT_BEARER]
export const DISCOUNT_BEARER_VALUES = Object.values(DISCOUNT_BEARER) as [
  DiscountBearerValue,
  ...DiscountBearerValue[],
]

export const COUPON_USER_SEGMENT = {
  NEW: 'new',
  RETURNING: 'returning',
  LOYAL: 'loyal',
} as const
export type CouponUserSegmentValue = (typeof COUPON_USER_SEGMENT)[keyof typeof COUPON_USER_SEGMENT]
export const COUPON_USER_SEGMENT_VALUES = Object.values(COUPON_USER_SEGMENT) as [
  CouponUserSegmentValue,
  ...CouponUserSegmentValue[],
]

/** Matches payouts table ENUM (not commission ledger). */
export const PAYOUT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const
export type PayoutStatus = (typeof PAYOUT_STATUS)[keyof typeof PAYOUT_STATUS]

export const COMMISSION_STATUS = {
  PENDING: 'PENDING',
  SETTLED: 'SETTLED',
  CLAWED_BACK: 'CLAWED_BACK',
} as const
export type CommissionStatus = (typeof COMMISSION_STATUS)[keyof typeof COMMISSION_STATUS]

export const CATEGORY_STATUS = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const
export type CategoryStatus = (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS]
export const CATEGORY_STATUS_VALUES = Object.values(CATEGORY_STATUS) as [
  CategoryStatus,
  ...CategoryStatus[],
]

export const CATEGORY_ATTRIBUTE_TYPE = {
  ENUM: 'ENUM',
  RANGE: 'RANGE',
  BOOLEAN: 'BOOLEAN',
} as const
export type CategoryAttributeType =
  (typeof CATEGORY_ATTRIBUTE_TYPE)[keyof typeof CATEGORY_ATTRIBUTE_TYPE]
export const CATEGORY_ATTRIBUTE_TYPE_VALUES = Object.values(CATEGORY_ATTRIBUTE_TYPE) as [
  CategoryAttributeType,
  ...CategoryAttributeType[],
]

/** Matches backend unavailableReason values on cart/wishlist items. */
export const UNAVAILABLE_REASON = {
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  PRODUCT_UNPUBLISHED: 'PRODUCT_UNPUBLISHED',
  VENDOR_UNAVAILABLE: 'VENDOR_UNAVAILABLE',
} as const
export type UnavailableReason = (typeof UNAVAILABLE_REASON)[keyof typeof UNAVAILABLE_REASON]
