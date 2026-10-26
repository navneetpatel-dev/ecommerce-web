import { LABELS } from "@/shared/constants/labels";

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

/** Menu label for each status a vendor can pick from the row editor. */
export const SUB_ORDER_STATUS_OPTION_LABELS: Readonly<Record<string, string>> =
  {
    [SUB_ORDER_STATUS_CONFIRMED]: LABELS.confirm,
    [SUB_ORDER_STATUS_SHIPPED]: LABELS.orderActionShip,
  };

/**
 * Statuses the vendor can move a sub-order to from its current one — mirrors the
 * backend's SUBORDER_MANUAL_TRANSITIONS. SHIPPED → SHIPPED re-enters the tracking id.
 * DELIVERED, CANCELLED and RETURNED are final here: no editor is offered.
 */
export const SUB_ORDER_NEXT_STATUSES: Readonly<
  Record<string, readonly string[]>
> = {
  PENDING: [SUB_ORDER_STATUS_CONFIRMED, SUB_ORDER_STATUS_SHIPPED],
  CONFIRMED: [SUB_ORDER_STATUS_SHIPPED],
  SHIPPED: [SUB_ORDER_STATUS_SHIPPED],
};

/** Statuses from which the vendor may cancel (backend allows PENDING/CONFIRMED → CANCELLED). */
export const SUB_ORDER_CANCELLABLE_STATUSES: ReadonlySet<string> = new Set([
  "PENDING",
  SUB_ORDER_STATUS_CONFIRMED,
]);
