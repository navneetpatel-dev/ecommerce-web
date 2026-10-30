import type { Order } from "@/shared/api/types";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "@/shared/constants/statuses";

const CLOSED_ORDER_STATUSES = new Set<string>([
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.RETURNED,
]);

/** An online order that was created before Razorpay captured the payment. */
export function canResumeRazorpayPayment(order: Order): boolean {
  return (
    order.paymentMethod === PAYMENT_METHOD.RAZORPAY &&
    order.paymentStatus === PAYMENT_STATUS.PENDING &&
    !CLOSED_ORDER_STATUSES.has(order.status)
  );
}
