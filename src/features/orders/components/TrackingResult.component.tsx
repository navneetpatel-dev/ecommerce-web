"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { TrackingLookupResult } from "../api/shipping.api";
import { useShipmentLocationSocket } from "../hooks/useShipmentLocationSocket.hook";
import { LiveDeliveryMap } from "./LiveDeliveryMap.component";

const REDELIVERY_SLOTS = [
  "Tomorrow morning (9am - 12pm)",
  "Tomorrow afternoon (12pm - 4pm)",
  "Tomorrow evening (4pm - 8pm)",
];

export function TrackingResult({
  result,
  onReschedule,
  isRescheduling,
}: {
  result: TrackingLookupResult;
  onReschedule: (slot: string) => void;
  isRescheduling?: boolean;
}) {
  const [slot, setSlot] = useState("");
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
            <p className="text-body-sm font-medium text-ink">
              {agent?.fullName ?? "Your delivery agent"} is on the way
            </p>
            <LiveDeliveryMap
              lat={mapLat!}
              lng={mapLng!}
              label={agent?.fullName ?? "Delivery agent"}
            />
          </div>
        ) : null}

        {canReschedule ? (
          <div className="space-y-2 rounded-md border border-line bg-surface-muted p-3">
            <p className="text-body-sm font-medium text-ink">
              {result.preferredRedeliverySlot
                ? `Redelivery requested: ${result.preferredRedeliverySlot}`
                : "Delivery didn't go through — pick a redelivery window:"}
            </p>
            <div className="flex gap-2">
              <Select value={slot} onValueChange={setSlot}>
                <SelectTrigger className="min-w-0 flex-1">
                  <SelectValue placeholder="Choose a time window" />
                </SelectTrigger>
                <SelectContent>
                  {REDELIVERY_SLOTS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                disabled={!slot}
                loading={isRescheduling}
                onClick={() => onReschedule(slot)}
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
