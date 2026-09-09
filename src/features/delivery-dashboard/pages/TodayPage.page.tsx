"use client";

import { TaskCard } from "../components/TaskCard.component";
import { ShiftSummaryCard } from "../components/ShiftSummaryCard.component";
import {
  useMyDeliveries,
  useMyPickups,
  useShiftSummary,
} from "../api/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { todayPageStyles } from "./todayPage.styles";

const ACTIVE_DELIVERIES = [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "FAILED",
  "RTO_INITIATED",
];

export function TodayPage() {
  const deliveries = useMyDeliveries(ACTIVE_DELIVERIES);
  const pickups = useMyPickups(["PICKUP_SCHEDULED"]);
  const shiftSummary = useShiftSummary();
  const deliveryCount = deliveries.data?.length ?? 0;
  const pickupCount = pickups.data?.length ?? 0;
  const count = deliveryCount + pickupCount;

  return (
    <div className={todayPageStyles.container}>
      <header className={todayPageStyles.header}>
        <div>
          <p className={todayPageStyles.queueBadge}>FIELD QUEUE</p>
          <h1 className={todayPageStyles.title}>Today</h1>
          <p className={todayPageStyles.subtitle}>
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

      {shiftSummary.data ? (
        <ShiftSummaryCard summary={shiftSummary.data} />
      ) : null}

      <div className={todayPageStyles.grid}>
        <section className={todayPageStyles.section}>
          <div className={todayPageStyles.sectionHeader}>
            <h2 className={todayPageStyles.sectionTitle}>Deliveries</h2>
            <span className={todayPageStyles.sectionCount}>
              {deliveryCount} active
            </span>
          </div>
          {deliveries.isLoading ? (
            <p className={todayPageStyles.loadingText}>Loading deliveries...</p>
          ) : deliveryCount > 0 ? (
            <div className={todayPageStyles.taskList}>
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
            <p className={todayPageStyles.emptyText}>No active deliveries.</p>
          )}
        </section>

        <section className={todayPageStyles.section}>
          <div className={todayPageStyles.sectionHeader}>
            <h2 className={todayPageStyles.sectionTitle}>Return pickups</h2>
            <span className={todayPageStyles.sectionCount}>
              {pickupCount} scheduled
            </span>
          </div>
          {pickups.isLoading ? (
            <p className={todayPageStyles.loadingText}>Loading pickups...</p>
          ) : pickupCount > 0 ? (
            <div className={todayPageStyles.taskList}>
              {pickups.data?.map((pickup) => (
                <TaskCard
                  key={pickup.id}
                  href={PATHS.delivery.pickup(pickup.id)}
                  title={
                    pickup.orderItem?.productName ??
                    pickup.productName ??
                    `Return ${pickup.id.slice(0, 8)}`
                  }
                  subtitle={`${pickup.type} · ${pickup.subOrder?.order?.shippingAddress?.city ?? "Address unavailable"}`}
                  status={pickup.status}
                />
              ))}
            </div>
          ) : (
            <p className={todayPageStyles.emptyText}>No scheduled pickups.</p>
          )}
        </section>
      </div>
    </div>
  );
}
