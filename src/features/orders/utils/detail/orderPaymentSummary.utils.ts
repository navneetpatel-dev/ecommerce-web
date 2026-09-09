import type { Order } from "@/shared/api/types";

export type OrderPaymentFields = Pick<
  Order,
  | "totalAmount"
  | "walletAmountUsed"
  | "razorpayAmountPaid"
  | "originalTotalAmount"
  | "pendingCashbackAmount"
  | "cashbackCreditedAt"
  | "paymentMethod"
  | "amountDue"
>;

/** Razorpay portion for display — backend always normalizes this on order responses. */
export function resolveOrderRazorpayPaid(order: OrderPaymentFields): number {
  return Number(order.razorpayAmountPaid ?? 0);
}

/** Whether the confirmation page should show the payment breakdown card. */
export function hasOrderPaymentSummaryContent(order: OrderPaymentFields): boolean {
  const walletUsed = Number(order.walletAmountUsed ?? 0);
  const razorpayPaid = resolveOrderRazorpayPaid(order);
  const pendingCashback = Number(order.pendingCashbackAmount ?? 0);
  const isCod = order.paymentMethod === "COD";
  const showSplit = walletUsed > 0 && razorpayPaid > 0;

  return (
    showSplit ||
    walletUsed > 0 ||
    pendingCashback > 0 ||
    Boolean(order.cashbackCreditedAt) ||
    (isCod && walletUsed <= 0)
  );
}
