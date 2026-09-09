/**
 * Sub-order status values the vendor may set from the orders table (Rule 8).
 * DELIVERED is deliberately absent — that transition only happens through
 * the delivery agent's OTP-gated confirmation, never a manual status pick,
 * so a vendor can't self-report delivery without proof the customer
 * actually received the order.
 */
export const SUB_ORDER_STATUS_CONFIRMED = "CONFIRMED";
export const SUB_ORDER_STATUS_SHIPPED = "SHIPPED";
export const SUB_ORDER_STATUS_CANCELLED = "CANCELLED";
