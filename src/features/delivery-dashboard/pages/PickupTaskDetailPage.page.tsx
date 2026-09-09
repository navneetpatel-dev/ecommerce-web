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
import { deliveryDetailPageStyles as styles } from "./deliveryDetailPage.styles";

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
    return <p className={styles.loadingText}>Loading pickup...</p>;
  if (!pickup)
    return (
      <p className={styles.notFoundText}>This assigned pickup was not found.</p>
    );
  const addressText = formatAddress(pickup.subOrder?.order?.shippingAddress);
  const exchange = pickup.type === "EXCHANGE";

  const onConfirm = async () => {
    if (await complete()) router.push(PATHS.delivery.today);
  };

  return (
    <div className={styles.container}>
      <div className={styles.backNav}>
        <Link href={PATHS.delivery.pickups} className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} aria-hidden="true" />
          Back to pickups
        </Link>
      </div>

      <header className={styles.header}>
        <div>
          <TextEyebrow brand>RETURN PICKUP TASK</TextEyebrow>
          <h1 className={styles.titleDisplay}>
            {productName ?? "Return pickup"}
          </h1>
          <p className={styles.subtitle}>
            {pickup.type} pickup · Return #{pickup.id.slice(0, 8)}
          </p>
        </div>
        <div className={styles.headerActions}>
          <StatusBadge status={pickup.status} />
          <LocationBeacon active={pickup.status === "PICKUP_SCHEDULED"} />
        </div>
      </header>

      {error ? <p className={styles.errorText}>{error}</p> : null}

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
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
            <div className={styles.processedBanner}>
              <CheckCircle2
                className={styles.processedIcon}
                aria-hidden="true"
              />
              <div>
                <p className={styles.processedTitle}>Pickup Processed</p>
                <p className={styles.processedSubtitle}>
                  Return collection status: {pickup.status}
                </p>
              </div>
            </div>
          )}

          {pickup.pickupFailureReason ? (
            <div className={styles.failureNoteBanner}>
              <span className={styles.failureNoteLabel}>
                Previous attempt note:
              </span>{" "}
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

        <aside className={styles.asideColumn}>
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
