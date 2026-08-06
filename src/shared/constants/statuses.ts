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
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  EXPIRED: 'EXPIRED',
} as const

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
