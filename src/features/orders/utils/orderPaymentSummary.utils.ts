import type { Order } from "@/shared/api/types";

type OrderPaymentFields = Pick<
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

/** Whether the confirmation page should show the payment breakdown card. */
export function hasOrderPaymentSummaryContent(order: OrderPaymentFields): boolean {
  const walletUsed = Number(order.walletAmountUsed ?? 0);
  const razorpayPaid = Number(order.razorpayAmountPaid ?? order.amountDue ?? 0);
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
