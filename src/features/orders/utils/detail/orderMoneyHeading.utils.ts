import { LABELS } from "@/shared/constants/labels";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/shared/constants/statuses";

/** "What you paid" only after the payment is settled. */
export function orderMoneyHeading(order: {
  paymentStatus?: string | null;
  paymentMethod?: string | null;
}): string {
  if (order.paymentStatus === PAYMENT_STATUS.PAID) return LABELS.whatYouPaid;
  if (order.paymentMethod === PAYMENT_METHOD.COD) return LABELS.orderTotalLabel;
  return LABELS.amountDueHeading;
}
