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
import { LiveDeliveryMap } from "../delivery-map/LiveDeliveryMap.component";
import { timeSince } from "@/shared/utils/geo/geo";
import { ordersComponentsStyles } from "../../styles/actions/ordersComponents.styles";
import { useTrackingResult } from "../../hooks/tracking/useTrackingResult.hook";

export function TrackingResult({
  result,
  onReschedule,
  isRescheduling,
}: {
  result: TrackingLookupResult;
  onReschedule: (slot: string) => void;
  isRescheduling?: boolean;
}) {
  const {
    canReschedule,
    hasLiveLocation,
    mapLat,
    mapLng,
    lastPingAt,
    liveLocationTitle,
    mapLabel,
    codLabel,
  } = useTrackingResult(result);

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

        {codLabel ? (
          <p className={ordersComponentsStyles.codText}>{codLabel}</p>
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

        {hasLiveLocation && mapLat != null && mapLng != null ? (
          <div className={ordersComponentsStyles.liveLocationStack}>
            <div className={ordersComponentsStyles.liveLocationHeader}>
              <p className={ordersComponentsStyles.liveLocationTitle}>
                {liveLocationTitle}
              </p>
              {lastPingAt ? (
                <span className={ordersComponentsStyles.liveLocationTime}>
                  Updated {timeSince(lastPingAt)}
                </span>
              ) : null}
            </div>
            <LiveDeliveryMap lat={mapLat} lng={mapLng} label={mapLabel} />
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
