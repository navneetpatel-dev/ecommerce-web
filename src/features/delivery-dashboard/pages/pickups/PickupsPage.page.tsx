"use client";

import { BarcodeScanButton } from "../../components/pickups/BarcodeScanButton.component";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { deliveryListPageStyles as styles } from "../deliveries/deliveryListPage.styles";
import { usePickupsPage } from "../../hooks/pickups/usePickupsPage.hook";
import { PickupTaskList } from "../../components/pickups/PickupTaskList.component";

export function PickupsPage() {
  const { query, count, pickupCountLabel, scanError, handleScanned } =
    usePickupsPage();

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
          <span className={styles.headerCount}>{pickupCountLabel}</span>
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
      ) : count > 0 && query.data ? (
        <PickupTaskList pickups={query.data} />
      ) : (
        <p className={styles.emptyNotice}>No scheduled pickups.</p>
      )}
    </div>
  );
}
