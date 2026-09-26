"use client";

import { useMemo } from "react";
import type { SubOrder } from "@/shared/api/types";
import { ORDER_STATUS, REFUND_STATUS } from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "../../utils/detail/format";
import { buildSubOrderTimeline } from "../../utils/sub-order/timeline";

interface UseSubOrderCardParams {
  subOrder: SubOrder;
}

export function useSubOrderCard({ subOrder }: UseSubOrderCardParams) {
  const timeline = useMemo(() => {
    return buildSubOrderTimeline(subOrder);
  }, [subOrder]);

  const showTimeline = subOrder.status !== ORDER_STATUS.PENDING;
  const vendorName = subOrder.vendor?.businessName || "Seller";
  const itemCount = subOrder.items?.length ?? 0;
  const canReturn = subOrder.status === ORDER_STATUS.DELIVERED;
  const items = useMemo(() => subOrder.items ?? [], [subOrder.items]);
  const refundNote = useMemo(() => subOrderRefundNote(subOrder), [subOrder]);

  return {
    timeline,
    showTimeline,
    vendorName,
    itemCount,
    canReturn,
    items,
    refundNote,
  };
}

const PART_REFUND_STATUS_LABEL: Record<string, string> = {
  [REFUND_STATUS.PENDING]: LABELS.partRefundPending,
  [REFUND_STATUS.INITIATED]: LABELS.partRefundInitiated,
  [REFUND_STATUS.COMPLETED]: LABELS.partRefundCompleted,
  [REFUND_STATUS.FAILED]: LABELS.partRefundFailed,
};

/** The card refund line for a cancelled or undelivered part, as the API reports it. */
function subOrderRefundNote(
  subOrder: SubOrder,
): { text: string; failed: boolean } | null {
  const amount = subOrder.cancelRefundAmount;
  if (amount == null || amount <= 0) return null;
  const status = subOrder.cancelRefundStatus ?? REFUND_STATUS.PENDING;
  const amountText = formatLabel(LABELS.partRefundToCard, {
    amount: formatInr(amount),
  });
  const statusText = PART_REFUND_STATUS_LABEL[status];
  return {
    text: statusText ? `${amountText} · ${statusText}` : amountText,
    failed: status === REFUND_STATUS.FAILED,
  };
}
