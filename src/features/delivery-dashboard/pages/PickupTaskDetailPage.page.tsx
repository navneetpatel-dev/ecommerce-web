"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { usePickup } from "../api/deliveryAgent.queries";
import { TaskContactCard } from "../components/TaskContactCard.component";
import { FailedAttemptSection } from "../components/FailedAttemptSection.component";
import { PickupChecklistCard } from "../components/PickupChecklistCard.component";
import { PickupOverviewCard } from "../components/PickupOverviewCard.component";
import { LocationBeacon } from "../components/LocationBeacon.component";
import { formatAddress } from "../utils/formatAddress";
import { PATHS } from "@/shared/constants/paths";
import { usePickupTaskActions } from "../hooks/usePickupTaskActions.hook";

export function PickupTaskDetailPage() {
  const { returnId } = useParams<{ returnId: string }>();
  const router = useRouter();
  const query = usePickup(returnId);
  const pickup = query.data;
  const productName = pickup?.orderItem?.productName ?? pickup?.productName;
  const {
    otpCode,
    setOtpCode,
    conditionFiles,
    setConditionFiles,
    replacementFile,
    setReplacementFile,
    failureNote,
    setFailureNote,
    error,
    confirm,
    failed,
    requestCode,
    upload,
    complete,
    recordFailure,
  } = usePickupTaskActions(returnId);

  if (query.isLoading)
    return <p className="text-ink-muted">Loading pickup...</p>;
  if (!pickup)
    return <p className="text-danger">This assigned pickup was not found.</p>;
  const addressText = formatAddress(pickup.subOrder?.order?.shippingAddress);
  const exchange = pickup.type === "EXCHANGE";

  const onConfirm = async () => {
    if (await complete()) router.push(PATHS.delivery.today);
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={PATHS.delivery.pickups}
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to pickups
        </Link>
      </div>

      <header className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <TextEyebrow brand>RETURN PICKUP TASK</TextEyebrow>
          <h1 className="mt-1 font-display text-[1.5rem] sm:text-[1.75rem] font-bold text-ink">
            {productName ?? "Return pickup"}
          </h1>
          <p className="mt-1 text-body-sm text-ink-muted">
            {pickup.type} pickup · Return #{pickup.id.slice(0, 8)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={pickup.status} />
          <LocationBeacon active={pickup.status === "PICKUP_SCHEDULED"} />
        </div>
      </header>

      {error ? <p className="text-body-sm text-danger">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          {pickup.status === "PICKUP_SCHEDULED" ? (
            <PickupChecklistCard
              exchange={exchange}
              otpCode={otpCode}
              onOtpCodeChange={setOtpCode}
              conditionFiles={conditionFiles}
              onConditionFilesChange={setConditionFiles}
              replacementFile={replacementFile}
              onReplacementFileChange={setReplacementFile}
              onConfirm={() => void onConfirm()}
              confirmPending={confirm.isPending || upload.isPending}
              requestCodePending={requestCode.isPending}
              requestCodeSuccess={requestCode.isSuccess}
              expiresInMinutes={requestCode.data?.expiresInMinutes}
              onRequestCode={() => requestCode.mutate(returnId)}
            />
          ) : (
            <div className="flex items-center gap-3 border border-line bg-surface p-5 shadow-elevation-1 text-success">
              <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Pickup Processed</p>
                <p className="text-body-sm text-ink-muted">
                  Return collection status: {pickup.status}
                </p>
              </div>
            </div>
          )}

          {pickup.pickupFailureReason ? (
            <div className="border border-line bg-surface p-4 text-body-sm text-warning shadow-elevation-1">
              <span className="font-medium">Previous attempt note:</span>{" "}
              {pickup.pickupFailureReason}
            </div>
          ) : null}

          {pickup.status === "PICKUP_SCHEDULED" ? (
            <FailedAttemptSection
              value={failureNote}
              onChange={setFailureNote}
              onSubmit={() => void recordFailure()}
              pending={failed.isPending}
              title="Report Pickup Issue"
              description="If the customer is unavailable, the item is damaged or missing, or the pickup cannot proceed, record the reason below:"
              placeholder="Required reason for failed pickup attempt (min 3 chars)"
              submitLabel="Record failed attempt"
            />
          ) : null}
        </div>

        <aside className="space-y-6 lg:col-span-5 xl:col-span-4">
          <TaskContactCard
            name={pickup.user?.name ?? "Customer"}
            phone={pickup.user?.phone}
            addressText={addressText}
            deliveryInstructions={
              pickup.subOrder?.order?.shippingAddress?.deliveryInstructions
            }
          />
          <PickupOverviewCard
            returnId={pickup.id}
            type={pickup.type}
            status={pickup.status}
            orderId={pickup.subOrder?.orderId}
            productName={productName}
          />
        </aside>
      </div>
    </div>
  );
}
