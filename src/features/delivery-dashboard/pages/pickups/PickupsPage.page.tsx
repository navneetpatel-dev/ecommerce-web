"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TaskCard } from "../../components/today/TaskCard.component";
import { BarcodeScanButton } from "../../components/pickups/BarcodeScanButton.component";
import { useMyPickups } from "../../api/agent/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths/paths";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { deliveryListPageStyles as styles } from "../deliveries/deliveryListPage.styles";

export function PickupsPage() {
  const router = useRouter();
  const [scanError, setScanError] = useState<string | null>(null);
  const query = useMyPickups(["PICKUP_SCHEDULED"]);
  const count = query.data?.length ?? 0;

  // Return pickups have no tracking number of their own — match the scanned
  // code against the pickup's id, same field the list already routes on.
  const handleScanned = (text: string) => {
    const match = query.data?.find(
      (pickup) => pickup.id.toUpperCase() === text.toUpperCase(),
    );
    if (!match) {
      setScanError(`No scheduled pickup matches "${text}".`);
      return;
    }
    setScanError(null);
    router.push(PATHS.delivery.pickup(match.id));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Pickups</h1>
          <p className={styles.subtitle}>
            Scheduled refund and exchange collections from customers.
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.headerCount}>
            {count} scheduled pickup{count === 1 ? "" : "s"}
          </span>
          <BarcodeScanButton onDecoded={handleScanned} />
        </div>
      </header>

      {scanError ? <p className={styles.errorNotice}>{scanError}</p> : null}

      {query.isError ? (
        <QueryErrorAlert
          error={query.error}
          fallback="Could not load pickups."
        />
      ) : null}

      {query.isLoading ? (
        <p className={styles.loadingText}>Loading pickups...</p>
      ) : count > 0 ? (
        <div className={styles.grid}>
          {query.data?.map((pickup) => (
            <TaskCard
              key={pickup.id}
              href={PATHS.delivery.pickup(pickup.id)}
              title={
                pickup.orderItem?.productName ??
                pickup.productName ??
                `Return ${pickup.id.slice(0, 8)}`
              }
              subtitle={`${pickup.type} · ${pickup.user?.name ?? "Customer"}`}
              status={pickup.status}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyNotice}>No scheduled pickups.</p>
      )}
    </div>
  );
}
