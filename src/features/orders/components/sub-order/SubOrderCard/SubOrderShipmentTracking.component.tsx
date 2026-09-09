"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import type { Shipment } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { RedeliverySlotPicker } from "@/shared/components/RedeliverySlotPicker.component";
import { SHIPMENT_STATUS } from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { DeliveryRatingPrompt } from "../../actions/DeliveryRatingPrompt.component";
import { shippingApi } from "../../../api/tracking/shipping.api";
import { ordersKeys } from "../../../api/orders/orders.queries";
import { subOrderShipmentTrackingStyles as styles } from "./subOrderShipmentTracking.styles";

interface SubOrderShipmentTrackingProps {
  shipment: Shipment;
  orderId: string;
}

/** Tracking/carrier/delivery-agent block for a suborder's shipment (Rule 3 split). */
export function SubOrderShipmentTracking({
  shipment,
  orderId,
}: SubOrderShipmentTrackingProps) {
  const queryClient = useQueryClient();
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const reschedule = useMutation({
    mutationFn: (slot: string) =>
      shippingApi.reschedule(shipment.trackingNumber, slot),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ordersKeys.detail(orderId),
      });
    },
  });

  const submitReschedule = async (slot: string) => {
    setRescheduleError(null);
    try {
      await reschedule.mutateAsync(slot);
    } catch (error) {
      setRescheduleError(
        getApiErrorMessage(error, "Could not reschedule delivery."),
      );
    }
  };

  const canCallAgent =
    Boolean(shipment.deliveryAgent?.phone) &&
    (
      [
        SHIPMENT_STATUS.PICKED_UP,
        SHIPMENT_STATUS.IN_TRANSIT,
        SHIPMENT_STATUS.OUT_FOR_DELIVERY,
      ] as string[]
    ).includes(shipment.status);

  return (
    <div className={styles.root}>
      <TextEyebrow className={styles.eyebrow}>Tracking</TextEyebrow>
      <p className={styles.carrier}>{shipment.carrier}</p>
      <p className={styles.trackingNumber}>{shipment.trackingNumber}</p>
      <div className={styles.statusWrapper}>
        <StatusBadge status={shipment.status} />
      </div>
      {shipment.deliveryAgent && (
        <div className={styles.agentRow}>
          <p className={styles.agentLabel}>
            Delivery agent: {shipment.deliveryAgent.fullName}
          </p>
          {canCallAgent ? (
            <a
              href={`tel:${shipment.deliveryAgent.phone}`}
              className={styles.callAgentLink}
            >
              <Phone className={styles.phoneIcon} aria-hidden="true" />
              Call agent
            </a>
          ) : null}
        </div>
      )}
      {shipment.status === SHIPMENT_STATUS.OUT_FOR_DELIVERY && (
        <p className={styles.bannerNotice}>
          Your order is out for delivery. Share the code from your email with
          the delivery agent to receive it.
        </p>
      )}
      {shipment.codAmount != null && (
        <p className={styles.codAmount}>
          Cash on delivery: ₹{shipment.codAmount.toFixed(2)}{" "}
          {shipment.codCollected ? "(collected)" : "(due at doorstep)"}
        </p>
      )}
      {shipment.attempts?.length ? (
        <div className={styles.attemptsList}>
          {shipment.attempts.map((attempt) => (
            <p key={attempt.id} className={styles.warningNotice}>
              Attempt {attempt.attemptNumber} note: {attempt.note}
              {attempt.photoUrl ? (
                <a
                  href={attempt.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.viewPhotoLink}
                >
                  View photo
                </a>
              ) : null}
            </p>
          ))}
        </div>
      ) : null}
      {shipment.status === SHIPMENT_STATUS.FAILED && (
        <div className={styles.failedContainer}>
          <p className={styles.warningNotice}>
            {shipment.failureReason
              ? `Delivery attempt failed: ${shipment.failureReason}`
              : "We couldn't deliver this — pick a new time to try again."}
          </p>
          <RedeliverySlotPicker
            currentSlot={shipment.preferredRedeliverySlot}
            onSubmit={(slot) => void submitReschedule(slot)}
            isPending={reschedule.isPending}
            prompt="Delivery didn't go through — pick a redelivery window:"
          />
          {rescheduleError ? (
            <p className={styles.errorMessage}>{rescheduleError}</p>
          ) : null}
        </div>
      )}
      {shipment.status === SHIPMENT_STATUS.RTO_INITIATED && (
        <p className={styles.warningNoticeWithMargin}>
          We couldn&apos;t deliver this after multiple attempts — it&apos;s
          being routed back to the seller.
        </p>
      )}
      {shipment.proofOfDeliveryUrl && (
        <a
          href={shipment.proofOfDeliveryUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.proofOfDeliveryLink}
        >
          View proof of delivery photo
        </a>
      )}
      {shipment.status === SHIPMENT_STATUS.DELIVERED && (
        <DeliveryRatingPrompt shipmentId={shipment.id} />
      )}
    </div>
  );
}
