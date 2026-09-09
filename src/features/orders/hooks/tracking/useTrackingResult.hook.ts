"use client";

import type { TrackingLookupResult } from "../../api/tracking/shipping.api";
import { useShipmentLocationSocket } from "../delivery-map/useShipmentLocationSocket.hook";
import { approximateDeliveryEtaText } from "../../utils/tracking/approximateEta";
import { formatCodAmountLabel } from "../../utils/tracking/codLabel";

const RESCHEDULABLE_STATUSES = ["FAILED", "RTO_INITIATED"];

export function useTrackingResult(result: TrackingLookupResult) {
  const canReschedule = RESCHEDULABLE_STATUSES.includes(result.status);
  const agent = result.deliveryAgent;
  const isOutForDelivery = result.status === "OUT_FOR_DELIVERY";
  const { location: liveLocation } = useShipmentLocationSocket(
    result.trackingNumber ?? null,
    isOutForDelivery,
  );
  const mapLat = liveLocation?.lat ?? agent?.lastLat ?? null;
  const mapLng = liveLocation?.lng ?? agent?.lastLng ?? null;
  const hasLiveLocation = isOutForDelivery && mapLat != null && mapLng != null;
  const lastPingAt =
    liveLocation?.updatedAt ?? agent?.locationUpdatedAt ?? null;
  const destination = result.destination;
  const etaText =
    hasLiveLocation && destination && mapLat != null && mapLng != null
      ? approximateDeliveryEtaText({ lat: mapLat, lng: mapLng }, destination)
      : null;
  const agentName = agent?.fullName ?? "Your delivery agent";
  const mapLabel = agent?.fullName ?? "Delivery agent";
  const liveLocationTitle = etaText
    ? `${agentName} is on the way — ${etaText}`
    : `${agentName} is on the way`;
  const codLabel =
    result.codAmount != null
      ? formatCodAmountLabel(result.codAmount, result.codCollected)
      : null;

  return {
    canReschedule,
    agent,
    hasLiveLocation,
    mapLat,
    mapLng,
    lastPingAt,
    liveLocationTitle,
    mapLabel,
    codLabel,
  };
}
