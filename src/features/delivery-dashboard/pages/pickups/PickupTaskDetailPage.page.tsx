"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { TaskContactCard } from "../../components/today/TaskContactCard.component";
import { FailedAttemptSection } from "../../components/deliveries/FailedAttemptSection.component";
import { PickupChecklistCard } from "../../components/pickups/PickupChecklistCard.component";
import { PickupOverviewCard } from "../../components/pickups/PickupOverviewCard.component";
import { LocationBeacon } from "../../components/location/LocationBeacon.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { usePickupTaskDetailPage } from "../../hooks/pickups/usePickupTaskDetailPage.hook";
import { deliveryDetailPageStyles as styles } from "../deliveries/deliveryDetailPage.styles";

export function PickupTaskDetailPage() {
  const page = usePickupTaskDetailPage();
  const { query, pickup, actions } = page;

  if (query.isLoading)
    return <p className={styles.loadingText}>Loading pickup...</p>;
  if (!pickup)
    return (
      <p className={styles.notFoundText}>This assigned pickup was not found.</p>
    );

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
            {page.productName ?? "Return pickup"}
          </h1>
          <p className={styles.subtitle}>
            {pickup.type} pickup · Return #{page.returnShortId}
          </p>
        </div>
        <div className={styles.headerActions}>
          <StatusBadge status={pickup.status} />
          <LocationBeacon active={page.isScheduled} />
        </div>
      </header>

      {actions.error ? (
        <p className={styles.errorText}>{actions.error}</p>
      ) : null}

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          {page.isScheduled ? (
            <PickupChecklistCard
              exchange={page.isExchange}
              otpCode={actions.otpCode}
              onOtpCodeChange={actions.setOtpCode}
              conditionFiles={actions.conditionFiles}
              onConditionFilesChange={actions.setConditionFiles}
              replacementFile={actions.replacementFile}
              onReplacementFileChange={actions.setReplacementFile}
              onConfirm={() => void page.onConfirm()}
              confirmPending={
                actions.confirm.isPending || actions.upload.isPending
              }
              requestCodePending={actions.requestCode.isPending}
              requestCodeSuccess={actions.requestCode.isSuccess}
              expiresInMinutes={actions.requestCode.data?.expiresInMinutes}
              onRequestCode={() => actions.requestCode.mutate(page.returnId)}
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

          {page.hasFailureReason ? (
            <div className={styles.failureNoteBanner}>
              <span className={styles.failureNoteLabel}>
                Previous attempt note:
              </span>{" "}
              {pickup.pickupFailureReason}
            </div>
          ) : null}

          {page.isScheduled ? (
            <FailedAttemptSection
              value={actions.failureNote}
              onChange={actions.setFailureNote}
              onSubmit={() => void actions.recordFailure()}
              pending={actions.failed.isPending}
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
            addressText={page.addressText}
            deliveryInstructions={
              pickup.subOrder?.order?.shippingAddress?.deliveryInstructions
            }
          />
          <PickupOverviewCard
            returnId={pickup.id}
            type={pickup.type}
            status={pickup.status}
            orderId={pickup.subOrder?.orderId}
            productName={page.productName}
          />
        </aside>
      </div>
    </div>
  );
}
