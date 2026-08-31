"use client";

import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Timeline } from "@/shared/components/Timeline.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate, formatInr } from "@/shared/utils/orderFormat";
import type { ReturnRequest } from "@/shared/api/types";
import {
  buildLogisticsTimeline,
  buildRefundTimeline,
} from "../utils/returnTimeline";
import { returnsApi } from "../api/returns.api";

const STATUS_LABEL: Record<string, string> = {
  [RETURN_STATUS.REQUESTED]: LABELS.returnLogisticsRequested,
  [RETURN_STATUS.APPROVED]: LABELS.returnLogisticsApproved,
  [RETURN_STATUS.REJECTED]: LABELS.returnLogisticsRejected,
  [RETURN_STATUS.PICKUP_SCHEDULED]: LABELS.returnLogisticsPickupScheduled,
  [RETURN_STATUS.RECEIVED]: LABELS.returnLogisticsReceived,
  [RETURN_STATUS.REFUNDED]: LABELS.returnRefundStatusCompleted,
  [RETURN_STATUS.CLOSED]: LABELS.returnLogisticsClosed,
};

interface ReturnRequestCardProps {
  row: ReturnRequest;
}

export function ReturnRequestCard({ row }: ReturnRequestCardProps) {
  const [pending, setPending] = useState(false);

  const downloadCredit = async () => {
    setPending(true);
    try {
      await returnsApi.downloadCreditNote(row.id);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="border border-line bg-surface-raised px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-ink">
            {row.productName || LABELS.orderItemFallback}
          </p>
          <p className="mt-1 text-body-sm text-ink-muted">
            {row.reasonCode.replaceAll("_", " ")} ·{" "}
            {formatOrderDate(row.createdAt)}
          </p>
          <p className="mt-1 text-[0.875rem] text-ink-muted">{row.reason}</p>
          {row.refundAmount != null ? (
            <p className="mt-1 text-body-sm tabular-nums text-ink">
              {LABELS.returnRefundStatusCompleted} {formatInr(row.refundAmount)}
            </p>
          ) : null}
          {row.creditNoteNumber ? (
            <p className="mt-1 text-body-sm text-ink-muted">
              CN: {row.creditNoteNumber}
              {row.againstInvoiceNumber
                ? ` · ${LABELS.againstInvoiceNumber}: ${row.againstInvoiceNumber}`
                : ""}
            </p>
          ) : null}
        </div>
        <Badge variant="outline">{STATUS_LABEL[row.status] ?? row.status}</Badge>
      </div>

      {row.creditNoteNumber ? (
        <div className="mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={pending}
            onClick={() => void downloadCredit()}
          >
            {LABELS.downloadCreditNote}
          </Button>
        </div>
      ) : null}

      <div className="mt-5 grid gap-6 border-t border-line pt-5 md:grid-cols-2">
        <div>
          <TextEyebrow className="mb-3">
            {LABELS.returnTimelineRefundTrack}
          </TextEyebrow>
          <Timeline steps={buildRefundTimeline(row)} />
        </div>
        <div>
          <TextEyebrow className="mb-3">
            {LABELS.returnTimelineLogisticsTrack}
          </TextEyebrow>
          <Timeline steps={buildLogisticsTimeline(row)} />
        </div>
      </div>
    </div>
  );
}
