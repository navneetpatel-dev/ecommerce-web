"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Timeline } from "@/shared/components/Timeline.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { RedeliverySlotPicker } from "@/shared/components/RedeliverySlotPicker.component";
import { LABELS } from "@/shared/constants/labels";
import type { ReturnRequest } from "@/shared/api/types";
import { RefundBreakdown } from "../detail/RefundBreakdown.component";
import { returnRequestCardStyles as styles } from "../../styles/list/returnRequestCard.styles";
import { useReturnRequestCard } from "../../hooks/list/useReturnRequestCard.hook";
import { ReturnRefundStatus } from "./ReturnRefundStatus.component";

interface ReturnRequestCardProps {
  row: ReturnRequest;
}

export function ReturnRequestCard({ row }: ReturnRequestCardProps) {
  const {
    productTitle,
    reasonCodeLabel,
    createdLabel,
    statusLabel,
    hasRefundAmount,
    creditNoteLine,
    isRejected,
    hasPickupFailure,
    refundTimeline,
    logisticsTimeline,
    pending,
    rescheduleError,
    isRescheduling,
    canReschedulePickup,
    downloadCredit,
    submitReschedule,
  } = useReturnRequestCard(row);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.contentCol}>
          <p className={styles.title}>{productTitle}</p>
          <p className={styles.subMeta}>
            {reasonCodeLabel} · {createdLabel}
          </p>
          <p className={styles.reason}>{row.reason}</p>
          {hasRefundAmount ? (
            <div className={styles.refundBox}>
              <ReturnRefundStatus row={row} />
              {row.refundCustomerMessage ? (
                <p className={styles.refundMuted}>{row.refundCustomerMessage}</p>
              ) : null}
              <RefundBreakdown row={row} />
            </div>
          ) : null}
          {creditNoteLine ? (
            <p className={styles.creditNote}>{creditNoteLine}</p>
          ) : null}
        </div>
        <Badge variant="outline">{statusLabel}</Badge>
      </div>

      {creditNoteLine ? (
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
          <Timeline steps={refundTimeline} />
        </div>
        <div>
          <TextEyebrow className={styles.eyebrowMargin}>
            {LABELS.returnTimelineLogisticsTrack}
          </TextEyebrow>
          <Timeline steps={logisticsTimeline} />
        </div>
      </div>

      {isRejected ? (
        <div className={styles.sectionDivided}>
          <p className={styles.rejectionBanner}>
            {LABELS.returnRejectionReasonPrefix} {row.rejectionReason}
          </p>
        </div>
      ) : null}

      {hasPickupFailure ? (
        <div className={styles.pickupFailSection}>
          <p className={styles.pickupFailBanner}>
            Last pickup attempt note: {row.pickupFailureReason}
          </p>
          {canReschedulePickup ? (
            <RedeliverySlotPicker
              currentSlot={row.preferredRepickupSlot}
              onSubmit={(slot) => void submitReschedule(slot)}
              isPending={isRescheduling}
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
