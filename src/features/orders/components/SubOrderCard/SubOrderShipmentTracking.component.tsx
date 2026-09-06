"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import type { Shipment } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { RedeliverySlotPicker } from "@/shared/components/RedeliverySlotPicker.component";
import { SHIPMENT_STATUS } from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { DeliveryRatingPrompt } from "../DeliveryRatingPrompt.component";
import { shippingApi } from "../../api/shipping.api";
import { ordersKeys } from "../../api/orders.queries";

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
    <div className="mt-4 border-t border-dashed border-line pt-4">
      <TextEyebrow className="mb-2">Tracking</TextEyebrow>
      <p className="text-body text-ink">{shipment.carrier}</p>
      <p className="mt-0.5 font-mono text-body-sm text-ink-muted">
        {shipment.trackingNumber}
      </p>
      <div className="mt-2">
        <StatusBadge status={shipment.status} />
      </div>
      {shipment.deliveryAgent && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-body-sm text-ink-muted">
            Delivery agent: {shipment.deliveryAgent.fullName}
          </p>
          {canCallAgent ? (
            <a
              href={`tel:${shipment.deliveryAgent.phone}`}
              className="inline-flex items-center gap-1 text-body-sm font-medium text-brand hover:underline"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              Call agent
            </a>
          ) : null}
        </div>
      )}
      {shipment.status === SHIPMENT_STATUS.OUT_FOR_DELIVERY && (
        <p className="mt-2 rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-ink">
          Your order is out for delivery. Share the code from your email with
          the delivery agent to receive it.
        </p>
      )}
      {shipment.codAmount != null && (
        <p className="mt-2 text-body-sm text-ink-muted">
          Cash on delivery: ₹{shipment.codAmount.toFixed(2)}{" "}
          {shipment.codCollected ? "(collected)" : "(due at doorstep)"}
        </p>
      )}
      {shipment.attempts?.length ? (
        <div className="mt-2 space-y-1.5">
          {shipment.attempts.map((attempt) => (
            <p
              key={attempt.id}
              className="rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning"
            >
              Attempt {attempt.attemptNumber} note: {attempt.note}
              {attempt.photoUrl ? (
                <a
                  href={attempt.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 font-medium text-brand hover:underline"
                >
                  View photo
                </a>
              ) : null}
            </p>
          ))}
        </div>
      ) : null}
      {shipment.status === SHIPMENT_STATUS.FAILED && (
        <div className="mt-2 space-y-2">
          <p className="rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning">
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
            <p className="text-body-sm text-danger">{rescheduleError}</p>
          ) : null}
        </div>
      )}
      {shipment.status === SHIPMENT_STATUS.RTO_INITIATED && (
        <p className="mt-2 rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning">
          We couldn&apos;t deliver this after multiple attempts — it&apos;s
          being routed back to the seller.
        </p>
      )}
      {shipment.proofOfDeliveryUrl && (
        <a
          href={shipment.proofOfDeliveryUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-body-sm font-medium text-brand hover:underline"
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
