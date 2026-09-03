"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import {
  useConfirmPickup,
  useMyPickups,
  useRequestPickupCode,
  useUpdatePickupStatus,
} from "../api/deliveryAgent.queries";
import { TaskContactCard } from "../components/TaskContactCard.component";
import { FailedAttemptSection } from "../components/FailedAttemptSection.component";
import { formatAddress } from "../utils/formatAddress";
import { usePresignUpload } from "@/shared/hooks/useUploads.hook";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { PATHS } from "@/shared/constants/paths";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

export function PickupTaskDetailPage() {
  const { returnId } = useParams<{ returnId: string }>();
  const router = useRouter();
  const query = useMyPickups();
  const confirm = useConfirmPickup();
  const failed = useUpdatePickupStatus();
  const requestCode = useRequestPickupCode();
  const upload = usePresignUpload();
  const pickup = query.data?.find((item) => item.id === returnId);
  const [otpCode, setOtpCode] = useState("");
  const [conditionFiles, setConditionFiles] = useState<File[]>([]);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [failureNote, setFailureNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (query.isLoading)
    return <p className="text-ink-muted">Loading pickup...</p>;
  if (!pickup)
    return <p className="text-danger">This assigned pickup was not found.</p>;
  const addressText = formatAddress(pickup.subOrder?.order?.shippingAddress);
  const exchange = pickup.type === "EXCHANGE";

  const uploadFile = async (file: File) =>
    (
      await upload.mutateAsync({
        entityType: UPLOAD_ENTITY.RETURNS,
        entityId: returnId,
        purpose: UPLOAD_PURPOSE.PHOTOS,
        filename: file.name,
        contentType: file.type,
        contentLength: file.size,
        file,
      })
    ).url;
  const complete = async () => {
    setError(null);
    try {
      const itemConditionPhotoUrls = await Promise.all(
        conditionFiles.map(uploadFile),
      );
      const replacementProofUrl = replacementFile
        ? await uploadFile(replacementFile)
        : undefined;
      await confirm.mutateAsync({
        returnId,
        otpCode,
        itemConditionPhotoUrls,
        replacementProofUrl,
      });
      router.push(PATHS.delivery.today);
    } catch (completeError) {
      setError(getApiErrorMessage(completeError, "Could not confirm pickup."));
    }
  };
  const recordFailure = async () => {
    try {
      await failed.mutateAsync({ returnId, note: failureNote.trim() });
      setFailureNote("");
    } catch (failureError) {
      setError(
        getApiErrorMessage(failureError, "Could not record the failed pickup."),
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-body-sm text-brand">{pickup.type}</p>
          <h1 className="font-display text-[1.5rem] text-ink">
            {pickup.productName ?? "Return pickup"}
          </h1>
        </div>
        <StatusBadge status={pickup.status} />
      </header>
      <TaskContactCard
        name={pickup.user?.name ?? "Customer"}
        phone={pickup.user?.phone}
        addressText={addressText}
      />
      <section className="space-y-4">
        <h2 className="font-display text-[1.125rem] text-ink">
          Pickup checklist
        </h2>
        <Button
          variant="outline"
          loading={requestCode.isPending}
          onClick={() => requestCode.mutate(returnId)}
        >
          Send pickup code to customer
        </Button>
        {requestCode.isSuccess ? (
          <p className="text-body-sm text-success">
            Code sent. It expires in {requestCode.data.expiresInMinutes}{" "}
            minutes.
          </p>
        ) : null}
        <label className="flex cursor-pointer items-center gap-2 border-b border-line pb-3 text-body font-medium text-brand">
          <Upload className="size-4" aria-hidden="true" />
          {conditionFiles.length
            ? `${conditionFiles.length} condition photo(s)`
            : `Add condition photos${exchange ? " (required)" : ""}`}
          <Input
            className="sr-only"
            type="file"
            multiple
            accept="image/*"
            capture="environment"
            onChange={(event) =>
              setConditionFiles(Array.from(event.target.files ?? []))
            }
          />
        </label>
        {exchange ? (
          <label className="flex cursor-pointer items-center gap-2 border-b border-line pb-3 text-body font-medium text-brand">
            <Upload className="size-4" aria-hidden="true" />
            {replacementFile?.name ??
              "Add replacement handover proof (required)"}
            <Input
              className="sr-only"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) =>
                setReplacementFile(event.target.files?.[0] ?? null)
              }
            />
          </label>
        ) : null}
        <Input
          inputMode="numeric"
          maxLength={6}
          value={otpCode}
          placeholder="Customer pickup code"
          onChange={(event) =>
            setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
        />
        <Button
          className="w-full"
          size="lg"
          disabled={
            otpCode.length !== 6 ||
            (exchange && (!conditionFiles.length || !replacementFile))
          }
          loading={confirm.isPending || upload.isPending}
          onClick={() => void complete()}
        >
          Confirm collected{exchange ? " and exchanged" : ""}
        </Button>
      </section>
      {pickup.status === "PICKUP_SCHEDULED" ? (
        <FailedAttemptSection
          value={failureNote}
          onChange={setFailureNote}
          onSubmit={() => void recordFailure()}
          pending={failed.isPending}
          placeholder="Required reason for failed pickup attempt"
          submitLabel="Record failed attempt"
          bordered
        />
      ) : null}
      {pickup.pickupFailureReason ? (
        <p className="text-body-sm text-warning">
          Last attempt: {pickup.pickupFailureReason}
        </p>
      ) : null}
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </div>
  );
}
