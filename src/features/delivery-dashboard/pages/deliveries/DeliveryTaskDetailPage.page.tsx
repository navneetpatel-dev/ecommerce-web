"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { useDelivery } from "../../api/agent/deliveryAgent.queries";
import { TaskContactCard } from "../../components/today/TaskContactCard.component";
import { FailedAttemptSection } from "../../components/deliveries/FailedAttemptSection.component";
import { DoorstepConfirmCard } from "../../components/doorstep/DoorstepConfirmCard.component";
import { RtoHandoverCard } from "../../components/rto/RtoHandoverCard.component";
import { ShipmentOverviewCard } from "../../components/deliveries/ShipmentOverviewCard.component";
import { LocationBeacon } from "../../components/location/LocationBeacon.component";
import { DeliveryMilestoneCard } from "../../components/deliveries/DeliveryMilestoneCard.component";
import { DeliveryTerminalStatusBanner } from "../../components/deliveries/DeliveryTerminalStatusBanner.component";
import { DeliveryAttemptsList } from "../../components/deliveries/DeliveryAttemptsList.component";
import { formatAddress } from "../../utils/deliveries/formatAddress";
import { NEXT_DELIVERY_STATUS } from "../../utils/deliveries/deliveryStatus";
import { PATHS } from "@/shared/constants/paths/paths";
import { useDeliveryTaskActions } from "../../hooks/deliveries/useDeliveryTaskActions.hook";
import { deliveryDetailPageStyles as styles } from "./deliveryDetailPage.styles";

const TERMINAL_STATUSES = [
  "DELIVERED",
  "FAILED",
  "RTO_INITIATED",
  "RTO_DELIVERED",
];

export function DeliveryTaskDetailPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const router = useRouter();
  const query = useDelivery(shipmentId);
  const shipment = query.data;
  const {
    otpCode,
    setOtpCode,
    failureNote,
    setFailureNote,
    failurePhoto,
    setFailurePhoto,
    proof,
    setProof,
    codCollected,
    setCodCollected,
    error,
    rtoOtpCode,
    setRtoOtpCode,
    update,
    confirm,
    requestCode,
    upload,
    requestRtoCode,
    confirmRto,
    runStatus,
    complete,
    completeRtoHandover,
  } = useDeliveryTaskActions(shipmentId, shipment?.codAmount);

  if (query.isLoading)
    return <p className={styles.loadingText}>Loading delivery...</p>;
  if (!shipment)
    return (
      <p className={styles.notFoundText}>
        This assigned delivery was not found.
      </p>
    );

  const order = shipment.subOrder?.order;
  const customer = order?.user;
  const addressText = formatAddress(order?.shippingAddress);
  const next = NEXT_DELIVERY_STATUS[shipment.status];

  const onConfirm = async () => {
    if (await complete()) router.push(PATHS.delivery.today);
  };

  const onConfirmRtoHandover = async () => {
    if (await completeRtoHandover()) router.push(PATHS.delivery.deliveries);
  };

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
            {order?.id ? `· Order #${order.id.slice(0, 8)}` : ""}
          </p>
        </div>
        <StatusBadge status={shipment.status} />
      </header>

      {error ? <p className={styles.errorText}>{error}</p> : null}

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          {shipment.status === "OUT_FOR_DELIVERY" ? (
            <>
              <LocationBeacon active />
              <DoorstepConfirmCard
                otpCode={otpCode}
                onOtpCodeChange={setOtpCode}
                proof={proof}
                onProofChange={setProof}
                onConfirm={() => void onConfirm()}
                confirmPending={confirm.isPending || upload.isPending}
                requestCodePending={requestCode.isPending}
                requestCodeSuccess={requestCode.isSuccess}
                expiresInMinutes={requestCode.data?.expiresInMinutes}
                onRequestCode={() => requestCode.mutate(shipmentId)}
                codAmount={shipment.codAmount}
                codCollected={codCollected}
                onCodCollectedChange={setCodCollected}
              />
            </>
          ) : shipment.status === "RTO_INITIATED" ? (
            <RtoHandoverCard
              otpCode={rtoOtpCode}
              onOtpCodeChange={setRtoOtpCode}
              onConfirm={() => void onConfirmRtoHandover()}
              confirmPending={confirmRto.isPending}
              requestCodePending={requestRtoCode.isPending}
              requestCodeSuccess={requestRtoCode.isSuccess}
              expiresInMinutes={requestRtoCode.data?.expiresInMinutes}
              onRequestCode={() => requestRtoCode.mutate(shipmentId)}
            />
          ) : next ? (
            <DeliveryMilestoneCard
              label={next.label}
              loading={update.isPending}
              onAdvance={() => void runStatus(next.status)}
            />
          ) : shipment.status === "DELIVERED" ? (
            <DeliveryTerminalStatusBanner variant="DELIVERED" />
          ) : shipment.status === "RTO_DELIVERED" ? (
            <DeliveryTerminalStatusBanner variant="RTO_DELIVERED" />
          ) : null}

          {shipment.attempts?.length ? (
            <DeliveryAttemptsList attempts={shipment.attempts} />
          ) : null}

          {!TERMINAL_STATUSES.includes(shipment.status) ? (
            <FailedAttemptSection
              value={failureNote}
              onChange={setFailureNote}
              onSubmit={() => void runStatus("FAILED", failureNote.trim())}
              placeholder="Required reason for failed attempt (min 3 chars)"
              submitLabel="Mark attempt failed"
              photo={failurePhoto}
              onPhotoChange={setFailurePhoto}
            />
          ) : null}
        </div>

        <aside className={styles.asideColumn}>
          <TaskContactCard
            name={customer?.name ?? "Customer"}
            phone={customer?.phone}
            addressText={addressText}
            deliveryInstructions={order?.shippingAddress?.deliveryInstructions}
          />
          <ShipmentOverviewCard
            trackingNumber={shipment.trackingNumber}
            status={shipment.status}
            orderId={order?.id}
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
