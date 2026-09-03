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
  const count = (deliveries.data?.length ?? 0) + (pickups.data?.length ?? 0);

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <header>
        <p className="text-body-sm font-medium text-brand">FIELD QUEUE</p>
        <h1 className="mt-1 font-display text-[1.75rem] text-ink">Today</h1>
        <p className="mt-1 text-body text-ink-muted">
          {count} active task{count === 1 ? "" : "s"}
        </p>
      </header>
      {deliveries.isError || pickups.isError ? (
        <QueryErrorAlert
          error={deliveries.error ?? pickups.error}
          fallback="Could not load assigned tasks."
        />
      ) : null}
      <section className="space-y-3">
        <h2 className="font-display text-[1.125rem] text-ink">Deliveries</h2>
        {deliveries.isLoading ? (
          <p className="text-ink-muted">Loading deliveries...</p>
        ) : deliveries.data?.length ? (
          deliveries.data.map((shipment) => (
            <TaskCard
              key={shipment.id}
              href={PATHS.delivery.delivery(shipment.id)}
              title={shipment.trackingNumber}
              subtitle={shipment.subOrder?.order?.shippingAddress?.city}
              status={shipment.status}
            />
          ))
        ) : (
          <p className="border-l-2 border-brand/30 pl-3 text-body text-ink-muted">
            No active deliveries.
          </p>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-[1.125rem] text-ink">
          Return pickups
        </h2>
        {pickups.isLoading ? (
          <p className="text-ink-muted">Loading pickups...</p>
        ) : pickups.data?.length ? (
          pickups.data.map((pickup) => (
            <TaskCard
              key={pickup.id}
              href={PATHS.delivery.pickup(pickup.id)}
              title={pickup.productName ?? `Return ${pickup.id.slice(0, 8)}`}
              subtitle={`${pickup.type} · ${pickup.subOrder?.order?.shippingAddress?.city ?? "Address unavailable"}`}
              status={pickup.status}
            />
          ))
        ) : (
          <p className="border-l-2 border-brand/30 pl-3 text-body text-ink-muted">
            No scheduled pickups.
          </p>
        )}
      </section>
    </div>
  );
}
