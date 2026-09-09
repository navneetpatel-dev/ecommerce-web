import type { Order } from "@/shared/api/types";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "@/shared/constants/statuses";

const CANCELLABLE_SUB_STATUSES = new Set<string>([
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
]);

const BLOCKED_ORDER_STATUSES = new Set<string>([
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.RETURNED,
]);

/** Mirrors backend cancelPaidOrder eligibility for paid customer orders. */
export function canCancelOrder(order: Order): boolean {
  if (order.paymentStatus !== PAYMENT_STATUS.PAID) return false;
  if (BLOCKED_ORDER_STATUSES.has(order.status)) return false;
  const subs = order.subOrders ?? [];
  if (subs.length === 0) return false;
  return subs.every((sub) => CANCELLABLE_SUB_STATUSES.has(sub.status));
}
