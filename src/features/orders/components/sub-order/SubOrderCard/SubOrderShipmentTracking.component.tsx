"use client";

import { Phone } from "lucide-react";
import type { Shipment } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { RedeliverySlotPicker } from "@/shared/components/RedeliverySlotPicker.component";
import { DeliveryRatingPrompt } from "../../actions/DeliveryRatingPrompt.component";
import { subOrderShipmentTrackingStyles as styles } from "../../../styles/sub-order/subOrderShipmentTracking.styles";
import { useSubOrderShipmentTracking } from "../../../hooks/sub-order/useSubOrderShipmentTracking.hook";
import { ProofOfDeliveryThumbnail } from "@/shared/components/ProofOfDeliveryThumbnail";
import { ShipmentAttemptsList } from "./ShipmentAttemptsList.component";

interface SubOrderShipmentTrackingProps {
  shipment: Shipment;
  orderId: string;
}

/** Tracking/carrier/delivery-agent block for a suborder's shipment (Rule 3 split). */
export function SubOrderShipmentTracking({
  shipment,
  orderId,
}: SubOrderShipmentTrackingProps) {
  const {
    rescheduleError,
    isRescheduling,
    submitReschedule,
    canCallAgent,
    agentTelHref,
    isOutForDelivery,
    isFailed,
    isRtoInitiated,
    isDelivered,
    hasAttempts,
    hasCod,
    hasProofOfDelivery,
    codLabel,
    failureMessage,
  } = useSubOrderShipmentTracking(shipment, orderId);

  return (
    <div className={styles.root}>
      <TextEyebrow className={styles.eyebrow}>Tracking</TextEyebrow>
      <p className={styles.carrier}>{shipment.carrier}</p>
      <p className={styles.trackingNumber}>{shipment.trackingNumber}</p>
      <div className={styles.statusWrapper}>
        <StatusBadge status={shipment.status} />
      </div>
      {shipment.deliveryAgent ? (
        <div className={styles.agentRow}>
          <p className={styles.agentLabel}>
            Delivery agent: {shipment.deliveryAgent.fullName}
          </p>
          {canCallAgent && agentTelHref ? (
            <a href={agentTelHref} className={styles.callAgentLink}>
              <Phone className={styles.phoneIcon} aria-hidden="true" />
              Call agent
            </a>
          ) : null}
        </div>
      ) : null}
      {isOutForDelivery ? (
        <p className={styles.bannerNotice}>
          Your order is out for delivery. Share the code from your email with
          the delivery agent to receive it.
        </p>
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
            onSubmit={(slot) => void submitReschedule(slot)}
            isPending={isRescheduling}
            prompt="Delivery didn't go through — pick a redelivery window:"
          />
          {rescheduleError ? (
            <p className={styles.errorMessage}>{rescheduleError}</p>
          ) : null}
        </div>
      ) : null}
      {isRtoInitiated ? (
        <p className={styles.warningNoticeWithMargin}>
          We couldn&apos;t deliver this after multiple attempts — it&apos;s
          being routed back to the seller.
        </p>
      ) : null}
      {hasProofOfDelivery ? (
        <ProofOfDeliveryThumbnail url={shipment.proofOfDeliveryUrl} />
      ) : null}
      {isDelivered ? <DeliveryRatingPrompt shipmentId={shipment.id} /> : null}
    </div>
  );
}
