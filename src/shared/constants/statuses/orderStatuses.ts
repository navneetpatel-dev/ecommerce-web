/** Order / payment / shipping / return status enums — keep values identical to backend Sequelize ENUMs. */

export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_METHOD = {
  RAZORPAY: "RAZORPAY",
  COD: "COD",
} as const;
export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const RETURN_STATUS = {
  REQUESTED: "REQUESTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PICKUP_SCHEDULED: "PICKUP_SCHEDULED",
  RECEIVED: "RECEIVED",
  REFUNDED: "REFUNDED",
  CLOSED: "CLOSED",
} as const;
export type ReturnStatus = (typeof RETURN_STATUS)[keyof typeof RETURN_STATUS];

export const RETURN_REASON = {
  DAMAGED: "DAMAGED",
  WRONG_ITEM: "WRONG_ITEM",
  NOT_AS_DESCRIBED: "NOT_AS_DESCRIBED",
  NO_LONGER_NEEDED: "NO_LONGER_NEEDED",
  OTHER: "OTHER",
} as const;
export type ReturnReason = (typeof RETURN_REASON)[keyof typeof RETURN_REASON];
export const RETURN_REASON_VALUES = Object.values(RETURN_REASON) as [
  ReturnReason,
  ...ReturnReason[],
];

export const REFUND_STATUS = {
  NONE: "NONE",
  PENDING: "PENDING",
  INITIATED: "INITIATED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;
export type RefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS];

export const REFUND_METHOD = {
  RAZORPAY: "RAZORPAY",
  WALLET_CREDIT: "WALLET_CREDIT",
} as const;
export type RefundMethod = (typeof REFUND_METHOD)[keyof typeof REFUND_METHOD];

export const SHIPMENT_STATUS = {
  PENDING: "PENDING",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
} as const;
export type ShipmentStatus =
  (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS];

export const SHIPPING_METHOD = {
  STANDARD: "STANDARD",
  EXPRESS: "EXPRESS",
} as const;
export type ShippingMethod =
  (typeof SHIPPING_METHOD)[keyof typeof SHIPPING_METHOD];
