"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "../../utils/detail/format";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import {
  hasOrderPaymentSummaryContent,
  resolveOrderRazorpayPaid,
} from "../../utils/detail/orderPaymentSummary.utils";
import { PAYMENT_STATUS } from "@/shared/constants/statuses";
import type { Order } from "@/shared/api/types";
import { ordersComponentsStyles } from "../actions/ordersComponents.styles";

interface OrderPaymentSummaryProps {
  order: Pick<
    Order,
    | "totalAmount"
    | "walletAmountUsed"
    | "razorpayAmountPaid"
    | "originalTotalAmount"
    | "pendingCashbackAmount"
    | "cashbackCreditedAt"
    | "paymentMethod"
    | "amountDue"
    | "paymentStatus"
  >;
  className?: string;
}

export function OrderPaymentSummary({
  order,
  className,
}: OrderPaymentSummaryProps) {
  if (!hasOrderPaymentSummaryContent(order)) {
    return null;
  }

  const walletUsed = Number(order.walletAmountUsed ?? 0);
  const razorpayPaid = resolveOrderRazorpayPaid(order);
  const pendingCashback = Number(order.pendingCashbackAmount ?? 0);
  const isCod = order.paymentMethod === "COD";
  const showSplit = walletUsed > 0 && razorpayPaid > 0;
  /**
   * `razorpayAmountPaid` is written at order creation as the amount *to* pay —
   * only the webhook flips paymentStatus to PAID. Phrasing it as settled before
   * then made this card contradict the order's own "Awaiting payment" badge.
   */
  const isSettled = order.paymentStatus === PAYMENT_STATUS.PAID;

  return (
    <div className={className}>
      {showSplit || walletUsed > 0 || (isCod && walletUsed <= 0) ? (
        <div className={ordersComponentsStyles.paymentWrapper}>
          <p className={ordersComponentsStyles.paymentTitle}>
            {LABELS.paymentSplitHeading}
          </p>
          {walletUsed > 0 ? (
            <p className={ordersComponentsStyles.paymentMuted}>
              {formatLabel(LABELS.paymentSplitWallet, {
                amount: formatPoints(walletUsed),
              })}
            </p>
          ) : null}
          {razorpayPaid > 0 ? (
            <p className={ordersComponentsStyles.paymentMuted}>
              {formatLabel(
                isSettled
                  ? LABELS.paymentSplitRazorpay
                  : LABELS.paymentSplitRazorpayDue,
                { amount: formatInr(razorpayPaid) },
              )}
            </p>
          ) : null}
          {!isSettled && !isCod && razorpayPaid > 0 ? (
            <p className={ordersComponentsStyles.paymentWarning}>
              {LABELS.paymentAwaitingConfirmation}
            </p>
          ) : null}
          {isCod && razorpayPaid <= 0 ? (
            <p className={ordersComponentsStyles.paymentMuted}>
              {LABELS.paymentSplitCod}
            </p>
          ) : null}
        </div>
      ) : null}

      {pendingCashback > 0 && !order.cashbackCreditedAt ? (
        <p className={ordersComponentsStyles.cashbackPending}>
          {LABELS.cashbackPendingAfterDelivery}
        </p>
      ) : null}

      {order.cashbackCreditedAt && pendingCashback > 0 ? (
        <p className={ordersComponentsStyles.cashbackCredited}>
          {formatLabel(LABELS.cashbackCreditedToWallet, {
            amount: formatInr(pendingCashback),
          })}
        </p>
      ) : null}
    </div>
  );
}
