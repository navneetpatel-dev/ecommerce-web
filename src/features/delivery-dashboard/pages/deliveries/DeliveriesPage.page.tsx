"use client";

import { BarcodeScanButton } from "../../components/pickups/BarcodeScanButton.component";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { deliveryListPageStyles as styles } from "./deliveryListPage.styles";
import { useDeliveriesPage } from "../../hooks/deliveries/useDeliveriesPage.hook";
import { DeliveryStopsList } from "../../components/deliveries/DeliveryStopsList.component";

export function DeliveriesPage() {
  const {
    query,
    count,
    stops,
    shipmentCountLabel,
    scanError,
    scanMessage,
    handleScanned,
  } = useDeliveriesPage();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Deliveries</h1>
          <p className={styles.subtitle}>
            Assigned delivery route and current fulfillment progress.
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.headerCount}>{shipmentCountLabel}</span>
          <BarcodeScanButton onDecoded={(text) => void handleScanned(text)} />
        </div>
      </header>

      {scanError ? <p className={styles.errorNotice}>{scanError}</p> : null}
      {scanMessage ? (
        <p className={styles.successNotice}>{scanMessage}</p>
      ) : null}

      {query.isError ? (
        <QueryErrorAlert
          error={query.error}
          fallback="Could not load deliveries."
        />
      ) : null}

      {query.isLoading ? (
        <p className={styles.loadingText}>Loading deliveries...</p>
      ) : count > 0 ? (
        <DeliveryStopsList stops={stops} />
      ) : (
        <p className={styles.emptyNotice}>No assigned deliveries.</p>
      )}
    </div>
  );
}
