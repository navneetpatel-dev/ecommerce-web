"use client";

import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { REFUND_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { Order } from "@/shared/api/types";
import { ordersComponentsStyles } from "./ordersComponents.styles";

interface OrderReturnStatusBannerProps {
  order: Order;
}

export function OrderReturnStatusBanner({
  order,
}: OrderReturnStatusBannerProps) {
  const openReturns = order.openReturnCount ?? 0;
  const alerts = order.returnRefundAlerts ?? [];
  const cancelRefundStatus = order.cancelRefundStatus;
  const cancelRefundLabel =
    cancelRefundStatus === REFUND_STATUS.INITIATED
      ? LABELS.orderCancelRefundInitiated
      : cancelRefundStatus === REFUND_STATUS.FAILED
        ? LABELS.orderCancelRefundFailed
        : cancelRefundStatus === REFUND_STATUS.COMPLETED
          ? LABELS.orderCancelRefundCompleted
          : cancelRefundStatus === REFUND_STATUS.PENDING
            ? LABELS.orderCancelRefundPending
            : null;

  if (openReturns === 0 && alerts.length === 0 && !cancelRefundLabel) {
    return null;
  }

  return (
    <div className={ordersComponentsStyles.bannerWrapper}>
      {openReturns > 0 ? (
        <Badge variant="secondary">
          {formatLabel(LABELS.orderOpenReturnsBadge, {
            count: String(openReturns),
          })}
        </Badge>
      ) : null}
      {alerts.map((row) => (
        <Badge
          key={row.id}
          variant={
            row.refundStatus === REFUND_STATUS.FAILED
              ? "destructive"
              : "secondary"
          }
        >
          {row.refundStatus === REFUND_STATUS.FAILED
            ? LABELS.returnRefundStatusFailed
            : LABELS.returnRefundStatusInitiated}
        </Badge>
      ))}
      {cancelRefundLabel ? (
        <Badge
          variant={
            cancelRefundStatus === REFUND_STATUS.FAILED
              ? "destructive"
              : "secondary"
          }
        >
          {cancelRefundLabel}
        </Badge>
      ) : null}
    </div>
  );
}
