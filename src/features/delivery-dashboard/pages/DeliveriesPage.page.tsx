"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TaskCard } from "../components/TaskCard.component";
import { BarcodeScanButton } from "../components/BarcodeScanButton.component";
import {
  useMyDeliveries,
  useUpdateDeliveryStatus,
} from "../api/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

export function DeliveriesPage() {
  const router = useRouter();
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const query = useMyDeliveries([
    "PENDING",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "FAILED",
    "RTO_INITIATED",
  ]);
  const updateStatus = useUpdateDeliveryStatus();
  const count = query.data?.length ?? 0;

  const handleScanned = async (text: string) => {
    const match = query.data?.find(
      (shipment) =>
        shipment.trackingNumber.toUpperCase() === text.toUpperCase(),
    );
    if (!match) {
      setScanError(`No assigned delivery matches "${text}".`);
      setScanMessage(null);
      return;
    }
    setScanError(null);
    if (match.status === "PENDING") {
      try {
        await updateStatus.mutateAsync({
          shipmentId: match.id,
          status: "PICKED_UP",
        });
        setScanMessage(`${match.trackingNumber} marked picked up.`);
      } catch (statusError) {
        setScanError(
          getApiErrorMessage(
            statusError,
            "Could not mark this shipment picked up.",
          ),
        );
      }
    }
    router.push(PATHS.delivery.delivery(match.id));
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <header className="flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.75rem] text-ink">Deliveries</h1>
          <p className="mt-1 text-body text-ink-muted">
            Assigned delivery route and current fulfillment progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-body-sm text-ink-muted">
            {count} active shipment{count === 1 ? "" : "s"}
          </span>
          <BarcodeScanButton onDecoded={(text) => void handleScanned(text)} />
        </div>
      </header>

      {scanError ? (
        <p className="text-body-sm text-danger">{scanError}</p>
      ) : null}
      {scanMessage ? (
        <p className="text-body-sm text-success">{scanMessage}</p>
      ) : null}

      {query.isError ? (
        <QueryErrorAlert
          error={query.error}
          fallback="Could not load deliveries."
        />
      ) : null}

      {query.isLoading ? (
        <p className="text-ink-muted">Loading deliveries...</p>
      ) : count > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {query.data?.map((shipment) => (
            <TaskCard
              key={shipment.id}
              href={PATHS.delivery.delivery(shipment.id)}
              title={shipment.trackingNumber}
              subtitle={shipment.subOrder?.order?.shippingAddress?.city}
              status={shipment.status}
            />
          ))}
        </div>
      ) : (
        <p className="border-l-2 border-brand/30 pl-3 text-body text-ink-muted py-2">
          No assigned deliveries.
        </p>
      )}
    </div>
  );
}
