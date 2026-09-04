"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { RedeliverySlotPicker } from "@/shared/components/RedeliverySlotPicker.component";
import type { TrackingLookupResult } from "../api/shipping.api";
import { useShipmentLocationSocket } from "../hooks/useShipmentLocationSocket.hook";
import { LiveDeliveryMap } from "./LiveDeliveryMap.component";
import { haversineDistanceKm, timeSince } from "@/shared/utils/geo";

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
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={result.status} />
          {result.carrier ? (
            <span className="text-body-sm text-ink-muted">
              via {result.carrier}
            </span>
          ) : null}
        </div>
        <p className="text-body text-ink-muted">
          Last update: {new Date(result.lastUpdate).toLocaleString()}
        </p>
        {result.estimatedDeliveryDate ? (
          <p className="text-body-sm text-ink-muted">
            Estimated delivery:{" "}
            {new Date(result.estimatedDeliveryDate).toLocaleDateString()}
          </p>
        ) : null}

        {result.codAmount != null ? (
          <p className="text-body-sm text-ink">
            Cash on delivery: ₹{result.codAmount.toFixed(2)}{" "}
            {result.codCollected ? "(collected)" : "(due at doorstep)"}
          </p>
        ) : null}

        {result.failureReason ? (
          <p className="rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning">
            Last attempt note: {result.failureReason}
          </p>
        ) : null}

        {result.proofOfDeliveryUrl ? (
          <a
            href={result.proofOfDeliveryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-body-sm font-medium text-brand hover:underline"
          >
            View proof of delivery photo
          </a>
        ) : null}

        {hasLiveLocation ? (
          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className="text-body-sm font-medium text-ink">
                {agent?.fullName ?? "Your delivery agent"} is on the way
                {etaText ? ` — ${etaText}` : ""}
              </p>
              {lastPingAt ? (
                <span className="text-caption text-ink-muted">
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
