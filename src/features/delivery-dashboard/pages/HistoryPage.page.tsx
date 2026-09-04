"use client";

import { TaskCard } from "../components/TaskCard.component";
import { useMyDeliveries, useMyPickups } from "../api/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths";

export function HistoryPage() {
  const deliveries = useMyDeliveries(["DELIVERED", "RTO_DELIVERED"]);
  const pickups = useMyPickups(["RECEIVED", "CLOSED"]);
  const deliveryCount = deliveries.data?.length ?? 0;
  const pickupCount = pickups.data?.length ?? 0;

  return (
    <div className="w-full min-w-0 space-y-8">
      <header className="flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.75rem] text-ink">History</h1>
          <p className="mt-1 text-body text-ink-muted">
            Completed delivery and return pickup assignments.
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="font-display text-[1.125rem] text-ink">
              Delivered shipments
            </h2>
            <span className="text-body-sm text-ink-muted">
              {deliveryCount} completed
            </span>
          </div>
          {deliveries.isLoading ? (
            <p className="text-ink-muted">Loading history...</p>
          ) : deliveryCount > 0 ? (
            <div className="space-y-3">
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
            </div>
          ) : (
            <p className="border-l-2 border-brand/30 pl-3 text-body text-ink-muted py-2">
              No completed deliveries yet.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="font-display text-[1.125rem] text-ink">
              Collected returns
            </h2>
            <span className="text-body-sm text-ink-muted">
              {pickupCount} completed
            </span>
          </div>
          {pickups.isLoading ? (
            <p className="text-ink-muted">Loading history...</p>
          ) : pickupCount > 0 ? (
            <div className="space-y-3">
              {pickups.data?.map((pickup) => (
                <TaskCard
                  key={pickup.id}
                  href={PATHS.delivery.pickup(pickup.id)}
                  title={
                    pickup.orderItem?.productName ??
                    pickup.productName ??
                    `Return ${pickup.id.slice(0, 8)}`
                  }
                  subtitle={pickup.type}
                  status={pickup.status}
                />
              ))}
            </div>
          ) : (
            <p className="border-l-2 border-brand/30 pl-3 text-body text-ink-muted py-2">
              No completed pickups yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
