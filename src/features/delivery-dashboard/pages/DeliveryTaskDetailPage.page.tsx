"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import {
  useConfirmDelivery,
  useMyDeliveries,
  useRequestDeliveryCode,
  useUpdateDeliveryStatus,
} from "../api/deliveryAgent.queries";
import { TaskContactCard } from "../components/TaskContactCard.component";
import { FailedAttemptSection } from "../components/FailedAttemptSection.component";
import { formatAddress } from "../utils/formatAddress";
import { usePresignUpload } from "@/shared/hooks/useUploads.hook";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { PATHS } from "@/shared/constants/paths";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

const NEXT_STATUS: Record<
  string,
  { status: string; label: string } | undefined
> = {
  PENDING: { status: "PICKED_UP", label: "Mark picked up" },
  PICKED_UP: { status: "IN_TRANSIT", label: "Start transit" },
  IN_TRANSIT: { status: "OUT_FOR_DELIVERY", label: "Start final delivery" },
  FAILED: { status: "IN_TRANSIT", label: "Resume transit" },
};

export function DeliveryTaskDetailPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const router = useRouter();
  const query = useMyDeliveries();
  const update = useUpdateDeliveryStatus();
  const confirm = useConfirmDelivery();
  const requestCode = useRequestDeliveryCode();
  const upload = usePresignUpload();
  const shipment = query.data?.find((item) => item.id === shipmentId);
  const [otpCode, setOtpCode] = useState("");
  const [failureNote, setFailureNote] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (query.isLoading)
    return <p className="text-ink-muted">Loading delivery...</p>;
  if (!shipment)
    return <p className="text-danger">This assigned delivery was not found.</p>;

  const order = shipment.subOrder?.order;
  const customer = order?.user;
  const addressText = formatAddress(order?.shippingAddress);
  const next = NEXT_STATUS[shipment.status];

  const runStatus = async (status: string, note?: string) => {
    setError(null);
    try {
      await update.mutateAsync({ shipmentId, status, note });
    } catch (statusError) {
      setError(
        getApiErrorMessage(statusError, "Could not update delivery status."),
      );
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
      await confirm.mutateAsync({ shipmentId, otpCode, proofPhotoUrl });
      router.push(PATHS.delivery.today);
    } catch (completeError) {
      setError(
        getApiErrorMessage(completeError, "Could not confirm delivery."),
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-body-sm text-ink-muted">Tracking</p>
          <h1 className="font-mono text-[1.25rem] text-ink">
            {shipment.trackingNumber}
          </h1>
        </div>
        <StatusBadge status={shipment.status} />
      </header>
      <TaskContactCard
        name={customer?.name ?? "Customer"}
        phone={customer?.phone}
        addressText={addressText}
      />
      {next ? (
        <Button
          className="w-full"
          size="lg"
          loading={update.isPending}
          onClick={() => void runStatus(next.status)}
        >
          {next.label}
        </Button>
      ) : null}
      {shipment.status === "OUT_FOR_DELIVERY" ? (
        <section className="space-y-4 border-y border-line py-5">
          <div>
            <h2 className="font-display text-[1.125rem] text-ink">
              Confirm at the doorstep
            </h2>
            <p className="mt-1 text-body-sm text-ink-muted">
              Enter the customer&apos;s six-digit code.
            </p>
          </div>
          <Button
            variant="outline"
            loading={requestCode.isPending}
            onClick={() => requestCode.mutate(shipmentId)}
          >
            Send new delivery code
          </Button>
          {requestCode.isSuccess ? (
            <p className="text-body-sm text-success">
              Code sent. It expires in {requestCode.data.expiresInMinutes}{" "}
              minutes.
            </p>
          ) : null}
          <Input
            inputMode="numeric"
            maxLength={6}
            value={otpCode}
            placeholder="Delivery code"
            onChange={(event) =>
              setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />
          <label className="flex cursor-pointer items-center gap-2 text-body-sm font-medium text-brand">
            <Upload className="size-4" aria-hidden="true" />
            {proof ? proof.name : "Add proof photo (optional)"}
            <Input
              className="sr-only"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => setProof(event.target.files?.[0] ?? null)}
            />
          </label>
          <Button
            className="w-full"
            size="lg"
            disabled={otpCode.length !== 6}
            loading={confirm.isPending || upload.isPending}
            onClick={() => void complete()}
          >
            Confirm delivered
          </Button>
        </section>
      ) : null}
      {!["DELIVERED", "FAILED"].includes(shipment.status) ? (
        <FailedAttemptSection
          value={failureNote}
          onChange={setFailureNote}
          onSubmit={() => void runStatus("FAILED", failureNote.trim())}
          placeholder="Required reason for failed attempt"
          submitLabel="Mark attempt failed"
        />
      ) : null}
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </div>
  );
}
