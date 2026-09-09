"use client";

import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Timeline } from "@/shared/components/Timeline.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { RedeliverySlotPicker } from "@/shared/components/RedeliverySlotPicker.component";
import { LABELS } from "@/shared/constants/labels";
import { REFUND_STATUS, RETURN_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate, formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { ReturnRequest } from "@/shared/api/types";
import { RefundBreakdown } from "../detail/RefundBreakdown.component";
import {
  buildLogisticsTimeline,
  buildRefundTimeline,
} from "../../utils/timeline/returnTimeline";
import { returnsApi } from "../../api/returns/returns.api";
import { useReschedulePickup } from "../../api/returns/returns.queries";
import { returnRequestCardStyles as styles } from "../../styles/list/returnRequestCard.styles";

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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.contentCol}>
          <p className={styles.title}>
            {row.productName || LABELS.orderItemFallback}
          </p>
          <p className={styles.subMeta}>
            {row.reasonCode.replaceAll("_", " ")} ·{" "}
            {formatOrderDate(row.createdAt)}
          </p>
          <p className={styles.reason}>{row.reason}</p>
          {row.refundAmount != null ? (
            <div className={styles.refundBox}>
              {row.refundStatus === REFUND_STATUS.COMPLETED ? (
                <p>
                  {LABELS.returnRefundStatusCompleted}{" "}
                  {formatInr(row.refundAmount)}
                </p>
              ) : row.refundStatus === REFUND_STATUS.INITIATED ? (
                <p className={styles.refundMuted}>
                  {LABELS.returnRefundStatusInitiated}
                  {(row.razorpayRefundAmount ?? 0) > 0
                    ? formatLabel(LABELS.returnRefundToBank, {
                        amount: formatInr(row.razorpayRefundAmount ?? 0),
                      })
                    : ""}
                  {(row.walletRefundAmount ?? 0) > 0
                    ? formatLabel(LABELS.returnRefundToWallet, {
                        amount: formatInr(row.walletRefundAmount ?? 0),
                      })
                    : ""}
                </p>
              ) : row.refundStatus === REFUND_STATUS.FAILED ? (
                <p className={styles.refundDanger}>
                  {LABELS.returnRefundStatusFailed}
                </p>
              ) : (
                <p className={styles.refundMuted}>
                  {LABELS.returnRefundStatusPending}
                </p>
              )}
              {row.refundCustomerMessage ? (
                <p className={styles.refundMuted}>
                  {row.refundCustomerMessage}
                </p>
              ) : null}
              <RefundBreakdown row={row} />
            </div>
          ) : null}
          {row.creditNoteNumber ? (
            <p className={styles.creditNote}>
              CN: {row.creditNoteNumber}
              {row.againstInvoiceNumber
                ? ` · ${LABELS.againstInvoiceNumber}: ${row.againstInvoiceNumber}`
                : ""}
            </p>
          ) : null}
        </div>
        <Badge variant="outline">
          {STATUS_LABEL[row.status] ?? row.status}
        </Badge>
      </div>

      {row.creditNoteNumber ? (
        <div className={styles.creditNoteAction}>
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

      <div className={styles.timelineGrid}>
        <div>
          <TextEyebrow className={styles.eyebrowMargin}>
            {LABELS.returnTimelineRefundTrack}
          </TextEyebrow>
          <Timeline steps={buildRefundTimeline(row)} />
        </div>
        <div>
          <TextEyebrow className={styles.eyebrowMargin}>
            {LABELS.returnTimelineLogisticsTrack}
          </TextEyebrow>
          <Timeline steps={buildLogisticsTimeline(row)} />
        </div>
      </div>

      {row.status === RETURN_STATUS.REJECTED && row.rejectionReason ? (
        <div className={styles.sectionDivided}>
          <p className={styles.rejectionBanner}>
            {LABELS.returnRejectionReasonPrefix} {row.rejectionReason}
          </p>
        </div>
      ) : null}

      {row.pickupFailureReason ? (
        <div className={styles.pickupFailSection}>
          <p className={styles.pickupFailBanner}>
            Last pickup attempt note: {row.pickupFailureReason}
          </p>
          {canReschedulePickup ? (
            <RedeliverySlotPicker
              currentSlot={row.preferredRepickupSlot}
              onSubmit={(slot) => void submitReschedule(slot)}
              isPending={reschedulePickup.isPending}
              prompt="Pickup didn't go through — pick a new time window:"
            />
          ) : null}
          {rescheduleError ? (
            <p className={styles.errorText}>{rescheduleError}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
