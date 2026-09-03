"use client";

import { TaskCard } from "../components/TaskCard.component";
import { useMyDeliveries, useMyPickups } from "../api/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths";

export function HistoryPage() {
  const deliveries = useMyDeliveries(["DELIVERED"]);
  const pickups = useMyPickups(["RECEIVED", "CLOSED"]);
  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <header>
        <h1 className="font-display text-[1.75rem] text-ink">History</h1>
        <p className="mt-1 text-body text-ink-muted">
          Completed delivery and pickup work.
        </p>
      </header>
      <section className="space-y-3">
        <h2 className="font-display text-[1.125rem] text-ink">Delivered</h2>
        {deliveries.data?.map((shipment) => (
          <TaskCard
            key={shipment.id}
            href={PATHS.delivery.delivery(shipment.id)}
            title={shipment.trackingNumber}
            subtitle={
              shipment.deliveredAt
                ? new Date(shipment.deliveredAt).toLocaleString()
                : null
            }
            status={shipment.status}
          />
        ))}
        {!deliveries.isLoading && !deliveries.data?.length ? (
          <p className="text-ink-muted">No completed deliveries.</p>
        ) : null}
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-[1.125rem] text-ink">Collected</h2>
        {pickups.data?.map((pickup) => (
          <TaskCard
            key={pickup.id}
            href={PATHS.delivery.pickup(pickup.id)}
            title={pickup.productName ?? `Return ${pickup.id.slice(0, 8)}`}
            subtitle={pickup.type}
            status={pickup.status}
          />
        ))}
        {!pickups.isLoading && !pickups.data?.length ? (
          <p className="text-ink-muted">No completed pickups.</p>
        ) : null}
      </section>
    </div>
  );
}
