"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { RedeliverySlotPicker } from "@/shared/components/RedeliverySlotPicker.component";
import type { TrackingLookupResult } from "../../api/tracking/shipping.api";
import { useShipmentLocationSocket } from "../../hooks/delivery-map/useShipmentLocationSocket.hook";
import { LiveDeliveryMap } from "../delivery-map/LiveDeliveryMap.component";
import { haversineDistanceKm, timeSince } from "@/shared/utils/geo/geo";
import { ordersComponentsStyles } from "../../styles/actions/ordersComponents.styles";

/** Rough urban delivery-bike pace, used only for the "approx." ETA label. */
const ASSUMED_SPEED_KMH = 18;

export function TrackingResult({
  result,
  onReschedule,
  isRescheduling,
}: {
  result: TrackingLookupResult;
  onReschedule: (slot: string) => void;
  isRescheduling?: boolean;
}) {
  const canReschedule = ["FAILED", "RTO_INITIATED"].includes(result.status);
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
    hasLiveLocation && destination
      ? (() => {
          const km = haversineDistanceKm(
            { lat: mapLat!, lng: mapLng! },
            destination,
          );
          const minutes = Math.max(
            1,
            Math.round((km / ASSUMED_SPEED_KMH) * 60),
          );
          return `~${minutes} min away (${km.toFixed(1)} km, approx.)`;
        })()
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking Result</CardTitle>
      </CardHeader>
      <CardContent className={ordersComponentsStyles.resultContent}>
        <div className={ordersComponentsStyles.carrierRow}>
          <StatusBadge status={result.status} />
          {result.carrier ? (
            <span className={ordersComponentsStyles.carrierText}>
              via {result.carrier}
            </span>
          ) : null}
        </div>
        <p className={ordersComponentsStyles.updateText}>
          Last update: {new Date(result.lastUpdate).toLocaleString()}
        </p>
        {result.estimatedDeliveryDate ? (
          <p className={ordersComponentsStyles.detailText}>
            Estimated delivery:{" "}
            {new Date(result.estimatedDeliveryDate).toLocaleDateString()}
          </p>
        ) : null}

        {result.codAmount != null ? (
          <p className={ordersComponentsStyles.codText}>
            Cash on delivery: ₹{result.codAmount.toFixed(2)}{" "}
            {result.codCollected ? "(collected)" : "(due at doorstep)"}
          </p>
        ) : null}

        {result.failureReason ? (
          <p className={ordersComponentsStyles.failureNote}>
            Last attempt note: {result.failureReason}
          </p>
        ) : null}

        {result.proofOfDeliveryUrl ? (
          <a
            href={result.proofOfDeliveryUrl}
            target="_blank"
            rel="noreferrer"
            className={ordersComponentsStyles.podLink}
          >
            View proof of delivery photo
          </a>
        ) : null}

        {hasLiveLocation ? (
          <div className={ordersComponentsStyles.liveLocationStack}>
            <div className={ordersComponentsStyles.liveLocationHeader}>
              <p className={ordersComponentsStyles.liveLocationTitle}>
                {agent?.fullName ?? "Your delivery agent"} is on the way
                {etaText ? ` — ${etaText}` : ""}
              </p>
              {lastPingAt ? (
                <span className={ordersComponentsStyles.liveLocationTime}>
                  Updated {timeSince(lastPingAt)}
                </span>
              ) : null}
            </div>
            <LiveDeliveryMap
              lat={mapLat!}
              lng={mapLng!}
              label={agent?.fullName ?? "Delivery agent"}
            />
          </div>
        ) : null}

        {canReschedule ? (
          <RedeliverySlotPicker
            currentSlot={result.preferredRedeliverySlot}
            onSubmit={onReschedule}
            isPending={isRescheduling}
            prompt="Delivery didn't go through — pick a redelivery window:"
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
