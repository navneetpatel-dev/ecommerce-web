"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import type { ReturnRequest } from "@/shared/api/types";
import {
  buildLogisticsTimeline,
  buildRefundTimeline,
} from "../../utils/timeline/returnTimeline";
import { returnsApi } from "../../api/returns/returns.api";
import { RETURN_STATUS_LABEL } from "../../constants/list/returnStatusLabels";
import { returnCreditNoteLine } from "../../utils/list/returnRefundStatus";

export function useReturnRequestCard(row: ReturnRequest) {
  const [pending, setPending] = useState(false);

  const downloadCredit = async () => {
    setPending(true);
    try {
      await returnsApi.downloadCreditNote(row.id);
    } catch (error) {
      notifyError(getApiErrorMessage(error, LABELS.downloadFailed));
    } finally {
      setPending(false);
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
    refundTimeline: buildRefundTimeline(row),
    logisticsTimeline: buildLogisticsTimeline(row),
    pending,
    downloadCredit,
  };
}
