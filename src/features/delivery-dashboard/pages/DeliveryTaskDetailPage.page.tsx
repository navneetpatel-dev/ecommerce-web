"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { useDelivery } from "../api/deliveryAgent.queries";
import { TaskContactCard } from "../components/TaskContactCard.component";
import { FailedAttemptSection } from "../components/FailedAttemptSection.component";
import { DoorstepConfirmCard } from "../components/DoorstepConfirmCard.component";
import { RtoHandoverCard } from "../components/RtoHandoverCard.component";
import { ShipmentOverviewCard } from "../components/ShipmentOverviewCard.component";
import { LocationBeacon } from "../components/LocationBeacon.component";
import { DeliveryMilestoneCard } from "../components/DeliveryMilestoneCard.component";
import { DeliveryTerminalStatusBanner } from "../components/DeliveryTerminalStatusBanner.component";
import { DeliveryAttemptsList } from "../components/DeliveryAttemptsList.component";
import { formatAddress } from "../utils/formatAddress";
import { NEXT_DELIVERY_STATUS } from "../utils/deliveryStatus";
import { PATHS } from "@/shared/constants/paths";
import { useDeliveryTaskActions } from "../hooks/useDeliveryTaskActions.hook";

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
    return <p className="text-ink-muted">Loading delivery...</p>;
  if (!shipment)
    return <p className="text-danger">This assigned delivery was not found.</p>;

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
    <div className="w-full min-w-0 space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={PATHS.delivery.deliveries}
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to deliveries
        </Link>
      </div>

      <header className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <TextEyebrow brand>DELIVERY TASK</TextEyebrow>
          <h1 className="mt-1 font-mono text-[1.5rem] sm:text-[1.75rem] font-bold tracking-tight text-ink">
            {shipment.trackingNumber}
          </h1>
          <p className="mt-1 text-body-sm text-ink-muted">
            Assigned fulfillment task{" "}
            {order?.id ? `· Order #${order.id.slice(0, 8)}` : ""}
          </p>
        </div>
        <StatusBadge status={shipment.status} />
      </header>

      {error ? <p className="text-body-sm text-danger">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
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

        <aside className="space-y-6 lg:col-span-5 xl:col-span-4">
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
