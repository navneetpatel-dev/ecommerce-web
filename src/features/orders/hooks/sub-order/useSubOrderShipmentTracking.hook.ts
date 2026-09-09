"use client";

import { useState } from "react";
import type { Shipment } from "@/shared/api/types";
import { SHIPMENT_STATUS } from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { CALLABLE_SHIPMENT_STATUSES } from "../../constants/sub-order/callableShipmentStatuses";
import { formatCodAmountLabel } from "../../utils/tracking/codLabel";
import { useRescheduleShipment } from "../../api/tracking/shipping.queries";

export function useSubOrderShipmentTracking(
  shipment: Shipment,
  orderId: string,
) {
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const reschedule = useRescheduleShipment(orderId, shipment.trackingNumber);

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
    CALLABLE_SHIPMENT_STATUSES.includes(shipment.status);

  const agentTelHref = shipment.deliveryAgent?.phone
    ? `tel:${shipment.deliveryAgent.phone}`
    : null;

  const isOutForDelivery = shipment.status === SHIPMENT_STATUS.OUT_FOR_DELIVERY;
  const isFailed = shipment.status === SHIPMENT_STATUS.FAILED;
  const isRtoInitiated = shipment.status === SHIPMENT_STATUS.RTO_INITIATED;
  const isDelivered = shipment.status === SHIPMENT_STATUS.DELIVERED;
  const hasAttempts = Boolean(shipment.attempts?.length);
  const hasCod = shipment.codAmount != null;
  const hasProofOfDelivery = Boolean(shipment.proofOfDeliveryUrl);

  const codLabel =
    shipment.codAmount != null
      ? formatCodAmountLabel(shipment.codAmount, shipment.codCollected)
      : null;

  const failureMessage = shipment.failureReason
    ? `Delivery attempt failed: ${shipment.failureReason}`
    : "We couldn't deliver this — pick a new time to try again.";

  return {
    rescheduleError,
    isRescheduling: reschedule.isPending,
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
  };
}
