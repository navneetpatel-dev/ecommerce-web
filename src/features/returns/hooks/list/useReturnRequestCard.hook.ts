"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { ReturnRequest } from "@/shared/api/types";
import {
  buildLogisticsTimeline,
  buildRefundTimeline,
} from "../../utils/timeline/returnTimeline";
import { returnsApi } from "../../api/returns/returns.api";
import { useReschedulePickup } from "../../api/returns/returns.queries";
import { RETURN_STATUS_LABEL } from "../../constants/list/returnStatusLabels";
import { returnCreditNoteLine } from "../../utils/list/returnRefundStatus";

export function useReturnRequestCard(row: ReturnRequest) {
  const [pending, setPending] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const reschedulePickup = useReschedulePickup();

  const downloadCredit = async () => {
    setPending(true);
    try {
      await returnsApi.downloadCreditNote(row.id);
    } finally {
      setPending(false);
    }
  };

  const canReschedulePickup =
    row.status === RETURN_STATUS.PICKUP_SCHEDULED &&
    Boolean(row.pickupFailureReason);

  const submitReschedule = async (slot: string) => {
    setRescheduleError(null);
    try {
      await reschedulePickup.mutateAsync({ id: row.id, slot });
    } catch (error) {
      setRescheduleError(
        getApiErrorMessage(error, "Could not reschedule pickup."),
      );
    }
  };

  return {
    productTitle: row.productName || LABELS.orderItemFallback,
    reasonCodeLabel: row.reasonCode.replaceAll("_", " "),
    createdLabel: formatOrderDate(row.createdAt),
    statusLabel: RETURN_STATUS_LABEL[row.status] ?? row.status,
    hasRefundAmount: row.refundAmount != null,
    creditNoteLine: returnCreditNoteLine(row),
    isRejected:
      row.status === RETURN_STATUS.REJECTED && Boolean(row.rejectionReason),
    hasPickupFailure: Boolean(row.pickupFailureReason),
    refundTimeline: buildRefundTimeline(row),
    logisticsTimeline: buildLogisticsTimeline(row),
    pending,
    rescheduleError,
    isRescheduling: reschedulePickup.isPending,
    canReschedulePickup,
    downloadCredit,
    submitReschedule,
  };
}
