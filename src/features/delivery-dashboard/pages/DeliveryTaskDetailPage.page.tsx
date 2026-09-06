"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import {
  useConfirmDelivery,
  useConfirmRtoHandover,
  useDelivery,
  useRequestDeliveryCode,
  useRequestRtoHandoverCode,
  useUpdateDeliveryStatus,
} from "../api/deliveryAgent.queries";
import { TaskContactCard } from "../components/TaskContactCard.component";
import { FailedAttemptSection } from "../components/FailedAttemptSection.component";
import { DoorstepConfirmCard } from "../components/DoorstepConfirmCard.component";
import { RtoHandoverCard } from "../components/RtoHandoverCard.component";
import { ShipmentOverviewCard } from "../components/ShipmentOverviewCard.component";
import { LocationBeacon } from "../components/LocationBeacon.component";
import { formatAddress } from "../utils/formatAddress";
import { NEXT_DELIVERY_STATUS } from "../utils/deliveryStatus";
import { usePresignUpload } from "@/shared/hooks/useUploads.hook";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { PATHS } from "@/shared/constants/paths";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

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
  const update = useUpdateDeliveryStatus();
  const confirm = useConfirmDelivery();
  const requestCode = useRequestDeliveryCode();
  const upload = usePresignUpload();
  const shipment = query.data;
  const [otpCode, setOtpCode] = useState("");
  const [failureNote, setFailureNote] = useState("");
  const [failurePhoto, setFailurePhoto] = useState<File | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [codCollected, setCodCollected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rtoOtpCode, setRtoOtpCode] = useState("");
  const requestRtoCode = useRequestRtoHandoverCode();
  const confirmRto = useConfirmRtoHandover();

  if (query.isLoading)
    return <p className="text-ink-muted">Loading delivery...</p>;
  if (!shipment)
    return <p className="text-danger">This assigned delivery was not found.</p>;

  const order = shipment.subOrder?.order;
  const customer = order?.user;
  const addressText = formatAddress(order?.shippingAddress);
  const next = NEXT_DELIVERY_STATUS[shipment.status];

  const runStatus = async (status: string, note?: string) => {
    setError(null);
    try {
      let photoUrl: string | undefined;
      if (status === "FAILED" && failurePhoto) {
        const result = await upload.mutateAsync({
          entityType: UPLOAD_ENTITY.SHIPMENTS,
          entityId: shipmentId,
          purpose: UPLOAD_PURPOSE.PROOF,
          filename: failurePhoto.name,
          contentType: failurePhoto.type,
          contentLength: failurePhoto.size,
          file: failurePhoto,
        });
        photoUrl = result.url;
      }
      await update.mutateAsync({ shipmentId, status, note, photoUrl });
      if (status === "FAILED") {
        setFailureNote("");
        setFailurePhoto(null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update delivery status."));
    }
  };

  const complete = async () => {
    setError(null);
    try {
      let proofPhotoUrl: string | undefined;
      if (proof) {
        const result = await upload.mutateAsync({
          entityType: UPLOAD_ENTITY.SHIPMENTS,
          entityId: shipmentId,
          purpose: UPLOAD_PURPOSE.PROOF,
          filename: proof.name,
          contentType: proof.type,
          contentLength: proof.size,
          file: proof,
        });
        proofPhotoUrl = result.url;
      }
      await confirm.mutateAsync({
        shipmentId,
        otpCode,
        proofPhotoUrl,
        codCollected: shipment.codAmount != null ? codCollected : undefined,
      });
      router.push(PATHS.delivery.today);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not confirm delivery."));
    }
  };

  const completeRtoHandover = async () => {
    setError(null);
    try {
      await confirmRto.mutateAsync({ shipmentId, otpCode: rtoOtpCode });
      router.push(PATHS.delivery.deliveries);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not confirm vendor handover."));
    }
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
                onConfirm={() => void complete()}
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
              onConfirm={() => void completeRtoHandover()}
              confirmPending={confirmRto.isPending}
              requestCodePending={requestRtoCode.isPending}
              requestCodeSuccess={requestRtoCode.isSuccess}
              expiresInMinutes={requestRtoCode.data?.expiresInMinutes}
              onRequestCode={() => requestRtoCode.mutate(shipmentId)}
            />
          ) : next ? (
            <div className="border border-line bg-surface shadow-elevation-1">
              <div className="border-b border-line bg-paper/55 px-5 py-3.5">
                <TextEyebrow className="!mb-0">Milestone Progress</TextEyebrow>
              </div>
              <div className="space-y-4 p-5 md:p-6">
                <div>
                  <h2 className="font-display text-[1.125rem] font-medium text-ink">
                    {next.label}
                  </h2>
                  <p className="mt-1 text-body-sm text-ink-muted">
                    Update the task status to proceed with the fulfillment
                    schedule.
                  </p>
                </div>
                <Button
                  size="lg"
                  loading={update.isPending}
                  onClick={() => void runStatus(next.status)}
                >
                  {next.label}
                </Button>
              </div>
            </div>
          ) : shipment.status === "DELIVERED" ? (
            <div className="flex items-center gap-3 border border-line bg-surface p-5 shadow-elevation-1 text-success">
              <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Delivery Completed</p>
                <p className="text-body-sm text-ink-muted">
                  Package successfully handed over.
                </p>
              </div>
            </div>
          ) : shipment.status === "RTO_DELIVERED" ? (
            <div className="flex items-center gap-3 border border-line bg-surface p-5 shadow-elevation-1 text-ink">
              <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Returned to vendor hub</p>
                <p className="text-body-sm text-ink-muted">
                  Undelivered parcel handed back after 3 failed attempts.
                </p>
              </div>
            </div>
          ) : null}

          {shipment.attempts?.length ? (
            <div className="space-y-2">
              {shipment.attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="border border-line bg-surface p-4 text-body-sm text-warning shadow-elevation-1"
                >
                  <span className="font-medium">
                    Attempt {attempt.attemptNumber}:
                  </span>{" "}
                  {attempt.note}
                  {attempt.photoUrl ? (
                    <a
                      href={attempt.photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 font-medium text-brand hover:underline"
                    >
                      View photo
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
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
