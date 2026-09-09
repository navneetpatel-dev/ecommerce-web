"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { TaskCard } from "../../components/today/TaskCard.component";
import { BarcodeScanButton } from "../../components/pickups/BarcodeScanButton.component";
import {
  useMyDeliveries,
  useUpdateDeliveryStatus,
} from "../../api/agent/deliveryAgent.queries";
import { groupShipmentsByStop } from "../../utils/deliveries/groupByStop";
import { PATHS } from "@/shared/constants/paths/paths";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { deliveryListPageStyles as styles } from "./deliveryListPage.styles";

export function DeliveriesPage() {
  const router = useRouter();
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const query = useMyDeliveries([
    "PENDING",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "FAILED",
    "RTO_INITIATED",
  ]);
  const updateStatus = useUpdateDeliveryStatus();
  const count = query.data?.length ?? 0;

  const handleScanned = async (text: string) => {
    const match = query.data?.find(
      (shipment) =>
        shipment.trackingNumber.toUpperCase() === text.toUpperCase(),
    );
    if (!match) {
      setScanError(`No assigned delivery matches "${text}".`);
      setScanMessage(null);
      return;
    }
    setScanError(null);
    if (match.status === "PENDING") {
      try {
        await updateStatus.mutateAsync({
          shipmentId: match.id,
          status: "PICKED_UP",
        });
        setScanMessage(`${match.trackingNumber} marked picked up.`);
      } catch (statusError) {
        setScanError(
          getApiErrorMessage(
            statusError,
            "Could not mark this shipment picked up.",
          ),
        );
      }
    }
    router.push(PATHS.delivery.delivery(match.id));
  };

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
          <span className={styles.headerCount}>
            {count} active shipment{count === 1 ? "" : "s"}
          </span>
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
        <div className={styles.grid}>
          {groupShipmentsByStop(query.data ?? []).map((stop) =>
            stop.shipments.length > 1 ? (
              <div key={stop.key} className={styles.stopCard}>
                <div className={styles.stopHeader}>
                  <p className={styles.stopTitle}>
                    {stop.shipments.length} packages to this address
                  </p>
                  {stop.addressText ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.addressText)}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.mapLink}
                    >
                      <ExternalLink
                        className={styles.mapIcon}
                        aria-hidden="true"
                      />
                      Open in Maps
                    </a>
                  ) : null}
                </div>
                <div className={styles.stopList}>
                  {stop.shipments.map((shipment) => (
                    <TaskCard
                      key={shipment.id}
                      href={PATHS.delivery.delivery(shipment.id)}
                      title={shipment.trackingNumber}
                      subtitle={shipment.subOrder?.order?.shippingAddress?.city}
                      status={shipment.status}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <TaskCard
                key={stop.shipments[0].id}
                href={PATHS.delivery.delivery(stop.shipments[0].id)}
                title={stop.shipments[0].trackingNumber}
                subtitle={
                  stop.shipments[0].subOrder?.order?.shippingAddress?.city
                }
                status={stop.shipments[0].status}
              />
            ),
          )}
        </div>
      ) : (
        <p className={styles.emptyNotice}>No assigned deliveries.</p>
      )}
    </div>
  );
}
