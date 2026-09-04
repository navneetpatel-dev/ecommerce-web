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
  const count = query.data?.length ?? 0;

  return (
    <div className="w-full min-w-0 space-y-6">
      <header className="flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.75rem] text-ink">Deliveries</h1>
          <p className="mt-1 text-body text-ink-muted">
            Assigned delivery route and current fulfillment progress.
          </p>
        </div>
        <span className="text-body-sm text-ink-muted">
          {count} active shipment{count === 1 ? "" : "s"}
        </span>
      </header>

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
