"use client";

import { TaskCard } from "../components/TaskCard.component";
import { useMyDeliveries, useMyPickups } from "../api/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";

const ACTIVE_DELIVERIES = [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "FAILED",
];

export function TodayPage() {
  const deliveries = useMyDeliveries(ACTIVE_DELIVERIES);
  const pickups = useMyPickups(["PICKUP_SCHEDULED"]);
  const deliveryCount = deliveries.data?.length ?? 0;
  const pickupCount = pickups.data?.length ?? 0;
  const count = deliveryCount + pickupCount;

  return (
    <div className="w-full min-w-0 space-y-8">
      <header className="flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-body-sm font-medium text-brand">FIELD QUEUE</p>
          <h1 className="mt-1 font-display text-[1.75rem] text-ink">Today</h1>
          <p className="mt-1 text-body text-ink-muted">
            {count} active task{count === 1 ? "" : "s"} in your current
            assignment queue.
          </p>
        </div>
      </header>

      {deliveries.isError || pickups.isError ? (
        <QueryErrorAlert
          error={deliveries.error ?? pickups.error}
          fallback="Could not load assigned tasks."
        />
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="font-display text-[1.125rem] text-ink">
              Deliveries
            </h2>
            <span className="text-body-sm text-ink-muted">
              {deliveryCount} active
            </span>
          </div>
          {deliveries.isLoading ? (
            <p className="text-ink-muted">Loading deliveries...</p>
          ) : deliveryCount > 0 ? (
            <div className="space-y-3">
              {deliveries.data?.map((shipment) => (
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
              No active deliveries.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="font-display text-[1.125rem] text-ink">
              Return pickups
            </h2>
            <span className="text-body-sm text-ink-muted">
              {pickupCount} scheduled
            </span>
          </div>
          {pickups.isLoading ? (
            <p className="text-ink-muted">Loading pickups...</p>
          ) : pickupCount > 0 ? (
            <div className="space-y-3">
              {pickups.data?.map((pickup) => (
                <TaskCard
                  key={pickup.id}
                  href={PATHS.delivery.pickup(pickup.id)}
                  title={
                    pickup.productName ?? `Return ${pickup.id.slice(0, 8)}`
                  }
                  subtitle={`${pickup.type} · ${pickup.subOrder?.order?.shippingAddress?.city ?? "Address unavailable"}`}
                  status={pickup.status}
                />
              ))}
            </div>
          ) : (
            <p className="border-l-2 border-brand/30 pl-3 text-body text-ink-muted py-2">
              No scheduled pickups.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
