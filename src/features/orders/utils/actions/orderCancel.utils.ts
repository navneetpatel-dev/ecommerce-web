import type { Order } from "@/shared/api/types";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "@/shared/constants/statuses";

const CANCELLABLE_SUB_STATUSES = new Set<string>([
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
]);

const REVERSED_SUB_STATUSES = new Set<string>([
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.RETURNED,
]);

const BLOCKED_ORDER_STATUSES = new Set<string>([
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.RETURNED,
]);

/**
 * Mirrors backend cancelPaidOrder eligibility for customers: paid orders, and COD
 * orders (unpaid until delivery), while nothing has shipped.
 */
export function canCancelOrder(order: Order): boolean {
  const isCod = order.paymentMethod === PAYMENT_METHOD.COD;
  if (order.paymentStatus !== PAYMENT_STATUS.PAID && !isCod) return false;
  if (BLOCKED_ORDER_STATUSES.has(order.status)) return false;
  // Parts already cancelled (or sent back) are done; the rest must not have shipped.
  const live = (order.subOrders ?? []).filter(
    (sub) => !REVERSED_SUB_STATUSES.has(sub.status),
  );
  if (live.length === 0) return false;
  return live.every((sub) => CANCELLABLE_SUB_STATUSES.has(sub.status));
}
