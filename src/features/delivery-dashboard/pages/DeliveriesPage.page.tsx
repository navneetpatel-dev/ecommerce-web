"use client";

import { TaskCard } from "../components/TaskCard.component";
import { useMyDeliveries } from "../api/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";

export function DeliveriesPage() {
  const query = useMyDeliveries([
    "PENDING",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "FAILED",
  ]);
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h1 className="font-display text-[1.75rem] text-ink">Deliveries</h1>
        <p className="mt-1 text-body text-ink-muted">
          Assigned delivery route and current progress.
        </p>
      </header>
      {query.isError ? (
        <QueryErrorAlert
          error={query.error}
          fallback="Could not load deliveries."
        />
      ) : null}
      <div className="space-y-3">
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
      {!query.isLoading && !query.data?.length ? (
        <p className="text-ink-muted">No assigned deliveries.</p>
      ) : null}
    </div>
  );
}
