"use client";

import { LABELS } from "@/shared/constants/labels";
import type { Review } from "@/shared/api/types";
import { VendorReviewRespondDialog } from "./VendorReviewRespondDialog.component";
import { VendorReviewFlagDialog } from "./VendorReviewFlagDialog.component";
import { VendorReviewsList } from "./VendorReviewsView/VendorReviewsList.component";
import { VendorReviewsSkeletonList } from "./VendorReviewsView/VendorReviewsSkeletonList.component";
import { useVendorReviewsViewState } from "../../hooks/reviews/useVendorReviewsViewState.hook";
import { vendorFeedbackViewsStyles as styles } from "../../styles/reviews/vendorFeedbackViews.styles";

interface VendorReviewsViewProps {
  reviews: Review[];
  isLoading?: boolean;
  loadError?: string | null;
  submitting?: boolean;
  onRespond: (reviewId: string, response: string) => void | Promise<void>;
  onFlag?: (reviewId: string, reason: string) => void | Promise<void>;
}

export function VendorReviewsView({
  reviews,
  isLoading = false,
  loadError = null,
  submitting = false,
  onRespond,
  onFlag,
}: VendorReviewsViewProps) {
  const {
    targetId,
    flagTargetId,
    activeReview,
    handleOpenRespond,
    handleOpenFlag,
    handleRespondOpenChange,
    handleFlagOpenChange,
    handleRespondSubmit,
    handleFlagSubmit,
    handleRemoveReply,
  } = useVendorReviewsViewState({ reviews, onRespond, onFlag });

  const loadingContent = isLoading ? <VendorReviewsSkeletonList /> : null;

  const errorContent = loadError ? (
    <p role="alert" className={styles.errorBox}>
      {loadError}
    </p>
  ) : null;

  const emptyContent =
    !isLoading && !loadError && !reviews.length ? (
      <p className={styles.emptyText}>{LABELS.noReviewsFound}</p>
    ) : null;

  const listContent =
    !isLoading && !loadError && reviews.length > 0 ? (
      <VendorReviewsList
        reviews={reviews}
        onOpenRespond={handleOpenRespond}
        onOpenFlag={handleOpenFlag}
        onRemoveReply={handleRemoveReply}
        canFlag={Boolean(onFlag)}
      />
    ) : null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{LABELS.reviews}</h1>
          <p className={styles.hint}>{LABELS.vendorReviewsHint}</p>
        </div>
      </div>

      {loadingContent}
      {errorContent}
      {emptyContent}
      {listContent}

      <VendorReviewRespondDialog
        open={Boolean(targetId)}
        initialResponse={activeReview?.vendorResponse ?? ""}
        submitting={submitting}
        onOpenChange={handleRespondOpenChange}
        onSubmit={handleRespondSubmit}
      />

      <VendorReviewFlagDialog
        open={Boolean(flagTargetId)}
        submitting={submitting}
        onOpenChange={handleFlagOpenChange}
        onSubmit={handleFlagSubmit}
      />
    </section>
  );
}
