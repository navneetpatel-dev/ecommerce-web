"use client";

import { TaskCard } from "../components/TaskCard.component";
import { useMyDeliveries, useMyPickups } from "../api/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths";
import { todayPageStyles as styles } from "./todayPage.styles";

export function HistoryPage() {
  const deliveries = useMyDeliveries(["DELIVERED", "RTO_DELIVERED"]);
  const pickups = useMyPickups(["RECEIVED", "CLOSED"]);
  const deliveryCount = deliveries.data?.length ?? 0;
  const pickupCount = pickups.data?.length ?? 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>History</h1>
          <p className={styles.subtitle}>
            Completed delivery and return pickup assignments.
          </p>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Delivered shipments</h2>
            <span className={styles.sectionCount}>
              {deliveryCount} completed
            </span>
          </div>
          {deliveries.isLoading ? (
            <p className={styles.loadingText}>Loading history...</p>
          ) : deliveryCount > 0 ? (
            <div className={styles.taskList}>
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
            <p className={styles.emptyText}>No completed deliveries yet.</p>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Collected returns</h2>
            <span className={styles.sectionCount}>{pickupCount} completed</span>
          </div>
          {pickups.isLoading ? (
            <p className={styles.loadingText}>Loading history...</p>
          ) : pickupCount > 0 ? (
            <div className={styles.taskList}>
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
            <p className={styles.emptyText}>No completed pickups yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
