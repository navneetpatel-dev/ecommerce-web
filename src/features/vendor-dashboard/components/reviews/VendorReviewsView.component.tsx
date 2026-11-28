"use client";

import { LABELS } from "@/shared/constants/labels";
import type { Review } from "@/shared/api/types";
import { VendorReviewRespondDialog } from "./VendorReviewRespondDialog.component";
import { VendorReviewFlagDialog } from "./VendorReviewFlagDialog.component";
import { VendorReviewsList } from "./VendorReviewsView/VendorReviewsList.component";
import { VendorReviewsSkeletonList } from "./VendorReviewsView/VendorReviewsSkeletonList.component";
import { useVendorReviewsViewState } from "../../hooks/reviews/useVendorReviewsViewState.hook";
import { useVendorReviewFilters } from "../../hooks/reviews/useVendorReviewFilters.hook";
import { VendorReviewFilters } from "./VendorReviewFilters.component";
import { VendorReviewsPager } from "./VendorReviewsPager.component";
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

  const filters = useVendorReviewFilters(reviews);

  const loadingContent = isLoading ? <VendorReviewsSkeletonList /> : null;

  const errorContent = loadError ? (
    <p role="alert" className={styles.errorBox}>
      {loadError}
    </p>
  ) : null;

  const emptyContent =
    !isLoading && !loadError && !filters.filteredReviews.length ? (
      <p className={styles.emptyText}>{LABELS.noReviewsFound}</p>
    ) : null;

  const listContent =
    !isLoading && !loadError && filters.filteredReviews.length > 0 ? (
      <>
        <VendorReviewsList
          reviews={filters.pagedReviews}
          onOpenRespond={handleOpenRespond}
          onOpenFlag={handleOpenFlag}
          onRemoveReply={handleRemoveReply}
          canFlag={Boolean(onFlag)}
        />
        <VendorReviewsPager filters={filters} />
      </>
    ) : null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{LABELS.reviews}</h1>
          <p className={styles.hint}>{LABELS.vendorReviewsHint}</p>
        </div>
      </div>

      <VendorReviewFilters filters={filters} total={reviews.length} />

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
