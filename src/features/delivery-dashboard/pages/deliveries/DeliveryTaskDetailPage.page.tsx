"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { TaskContactCard } from "../../components/today/TaskContactCard.component";
import { FailedAttemptSection } from "../../components/deliveries/FailedAttemptSection.component";
import { ShipmentOverviewCard } from "../../components/deliveries/ShipmentOverviewCard.component";
import { DeliveryAttemptsList } from "../../components/deliveries/DeliveryAttemptsList.component";
import { DeliveryTaskPrimaryPanel } from "../../components/deliveries/DeliveryTaskPrimaryPanel.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { useDeliveryTaskDetailPage } from "../../hooks/deliveries/useDeliveryTaskDetailPage.hook";
import { deliveryDetailPageStyles as styles } from "./deliveryDetailPage.styles";

export function DeliveryTaskDetailPage() {
  const page = useDeliveryTaskDetailPage();
  const { query, shipment, actions } = page;

  if (query.isLoading)
    return <p className={styles.loadingText}>Loading delivery...</p>;
  if (!shipment)
    return (
      <p className={styles.notFoundText}>
        This assigned delivery was not found.
      </p>
    );

  return (
    <div className={styles.container}>
      <div className={styles.backNav}>
        <Link href={PATHS.delivery.deliveries} className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} aria-hidden="true" />
          Back to deliveries
        </Link>
      </div>

      <header className={styles.header}>
        <div>
          <TextEyebrow brand>DELIVERY TASK</TextEyebrow>
          <h1 className={styles.titleMono}>{shipment.trackingNumber}</h1>
          <p className={styles.subtitle}>
            Assigned fulfillment task{" "}
            {page.orderShortId ? `· Order #${page.orderShortId}` : ""}
          </p>
        </div>
        <StatusBadge status={shipment.status} />
      </header>

      {actions.error ? (
        <p className={styles.errorText}>{actions.error}</p>
      ) : null}

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          <DeliveryTaskPrimaryPanel
            shipment={shipment}
            shipmentId={page.shipmentId}
            actions={actions}
            next={page.next}
            isOutForDelivery={page.isOutForDelivery}
            isRtoInitiated={page.isRtoInitiated}
            isDelivered={page.isDelivered}
            isRtoDelivered={page.isRtoDelivered}
            onConfirm={() => void page.onConfirm()}
            onConfirmRtoHandover={() => void page.onConfirmRtoHandover()}
          />

          {page.hasAttempts && shipment.attempts ? (
            <DeliveryAttemptsList attempts={shipment.attempts} />
          ) : null}

          {!page.isTerminal ? (
            <FailedAttemptSection
              value={actions.failureNote}
              onChange={actions.setFailureNote}
              onSubmit={() =>
                void actions.runStatus("FAILED", actions.failureNote.trim())
              }
              placeholder="Required reason for failed attempt (min 3 chars)"
              submitLabel="Mark attempt failed"
              photo={actions.failurePhoto}
              onPhotoChange={actions.setFailurePhoto}
            />
          ) : null}
        </div>

        <aside className={styles.asideColumn}>
          <TaskContactCard
            name={page.customer?.name ?? "Customer"}
            phone={page.customer?.phone}
            addressText={page.addressText}
            deliveryInstructions={
              page.order?.shippingAddress?.deliveryInstructions
            }
          />
          <ShipmentOverviewCard
            trackingNumber={shipment.trackingNumber}
            status={shipment.status}
            orderId={page.order?.id}
            assignedAt={shipment.assignedAt}
            items={shipment.subOrder?.items}
            codAmount={shipment.codAmount}
            codCollected={shipment.codCollected}
            proofOfDeliveryUrl={shipment.proofOfDeliveryUrl}
            failureReason={shipment.failureReason}
            preferredRedeliverySlot={shipment.preferredRedeliverySlot}
          />
        </aside>
      </div>
    </div>
  );
}
