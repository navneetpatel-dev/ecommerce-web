"use client";

import type { Shipment } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { CopyTextButton } from "@/shared/components/actions/CopyTextButton.component";
import { RedeliverySlotPicker } from "@/shared/components/orders/RedeliverySlotPicker.component";
import { subOrderShipmentTrackingStyles as styles } from "../../../styles/sub-order/subOrderShipmentTracking.styles";
import { useSubOrderShipmentTracking } from "../../../hooks/sub-order/useSubOrderShipmentTracking.hook";
import { ShipmentAttemptsList } from "./ShipmentAttemptsList.component";

interface SubOrderShipmentTrackingProps {
  shipment: Shipment;
  orderId: string;
}

/** Tracking/carrier block for a suborder's shipment (Rule 3 split). */
export function SubOrderShipmentTracking({
  shipment,
  orderId,
}: SubOrderShipmentTrackingProps) {
  const {
    rescheduleError,
    isRescheduling,
    submitReschedule,
    isOutForDelivery,
    isFailed,
    isRtoInitiated,
    hasAttempts,
    hasCod,
    codLabel,
    failureMessage,
  } = useSubOrderShipmentTracking(shipment, orderId);

  const handleRescheduleSubmit = (slot: string) => void submitReschedule(slot);

  return (
    <div className={styles.root}>
      <TextEyebrow className={styles.eyebrow}>Tracking</TextEyebrow>
      <p className={styles.carrier}>{shipment.carrier}</p>
      <div className={styles.trackingRow}>
        <p className={styles.trackingNumber}>{shipment.trackingNumber}</p>
        <CopyTextButton
          value={shipment.trackingNumber}
          label={LABELS.copyTrackingNumber}
        />
      </div>
      <div className={styles.statusWrapper}>
        <StatusBadge status={shipment.status} />
      </div>
      {isOutForDelivery ? (
        <p className={styles.bannerNotice}>Your order is out for delivery.</p>
      ) : null}
      {hasCod ? <p className={styles.codAmount}>{codLabel}</p> : null}
      {hasAttempts && shipment.attempts ? (
        <ShipmentAttemptsList attempts={shipment.attempts} />
      ) : null}
      {isFailed ? (
        <div className={styles.failedContainer}>
          <p className={styles.warningNotice}>{failureMessage}</p>
          <RedeliverySlotPicker
            currentSlot={shipment.preferredRedeliverySlot}
            onSubmit={handleRescheduleSubmit}
            isPending={isRescheduling}
            prompt={LABELS.trackingRedeliveryPrompt}
          />
          {rescheduleError ? (
            <p role="alert" className={styles.errorMessage}>
              {rescheduleError}
            </p>
          ) : null}
        </div>
      ) : null}
      {isRtoInitiated ? (
        <p className={styles.warningNoticeWithMargin}>
          We couldn&apos;t deliver this after multiple attempts — it&apos;s
          being routed back to the seller.
        </p>
      ) : null}
    </div>
  );
}
