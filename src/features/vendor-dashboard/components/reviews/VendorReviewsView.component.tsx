"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import type { Review } from "@/shared/api/types";
import { VendorReviewRespondDialog } from "./VendorReviewRespondDialog.component";
import { VendorReviewFlagDialog } from "./VendorReviewFlagDialog.component";
import { vendorFeedbackViewsStyles } from "../../styles/reviews/vendorFeedbackViews.styles";

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
  const [targetId, setTargetId] = useState<string | null>(null);
  const [flagTargetId, setFlagTargetId] = useState<string | null>(null);

  const activeReview = reviews.find((r) => r.id === targetId);

  const closeRespond = () => setTargetId(null);
  const handleRespondOpenChange = (open: boolean) => {
    if (!open) setTargetId(null);
  };
  const handleRespondSubmit = (response: string) => {
    if (!targetId) return;
    void Promise.resolve(onRespond(targetId, response)).then(closeRespond);
  };

  const closeFlag = () => setFlagTargetId(null);
  const handleFlagOpenChange = (open: boolean) => {
    if (!open) setFlagTargetId(null);
  };
  const handleFlagSubmit = (reason: string) => {
    if (!flagTargetId || !onFlag) return;
    void Promise.resolve(onFlag(flagTargetId, reason)).then(closeFlag);
  };

  return (
    <section className={vendorFeedbackViewsStyles.section}>
      <div className={vendorFeedbackViewsStyles.header}>
        <div className={vendorFeedbackViewsStyles.headerInfo}>
          <h1 className={vendorFeedbackViewsStyles.title}>{LABELS.reviews}</h1>
          <p className={vendorFeedbackViewsStyles.hint}>
            {LABELS.vendorReviewsHint}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div
          className={vendorFeedbackViewsStyles.loadingStack}
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className={vendorFeedbackViewsStyles.skeleton}
            />
          ))}
        </div>
      ) : loadError ? (
        <p role="alert" className={vendorFeedbackViewsStyles.errorBox}>
          {loadError}
        </p>
      ) : null}

      {!isLoading && !loadError
        ? reviews.map((review) => {
            const openRespond = () => setTargetId(review.id);
            return (
              <article
                key={review.id}
                className={vendorFeedbackViewsStyles.card}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={vendorFeedbackViewsStyles.cardTitle}>
                      {review.title?.trim() || LABELS.reviewUntitled} ·{" "}
                      {formatLabel(LABELS.reviewRatingOutOf, {
                        rating: String(review.rating),
                      })}
                    </p>
                    {review.product?.name ? (
                      <p className={vendorFeedbackViewsStyles.cardSubtitle}>
                        {review.product.name}
                      </p>
                    ) : null}
                  </div>
                  {review.flaggedReason ? (
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      Flagged for Moderation
                    </span>
                  ) : onFlag ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                      onClick={() => setFlagTargetId(review.id)}
                    >
                      Flag Review
                    </Button>
                  ) : null}
                </div>

                <p className={vendorFeedbackViewsStyles.cardBody}>
                  {review.body}
                </p>

                {review.vendorResponse ? (
                  <div className="mt-3 p-3 bg-muted/40 rounded-md border text-sm space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Your Seller Reply:
                      </span>
                      {review.vendorRespondedAt ? (
                        <span>{formatDate(review.vendorRespondedAt)}</span>
                      ) : null}
                    </div>
                    <p className="text-foreground">{review.vendorResponse}</p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={openRespond}
                        className="h-7 text-xs"
                      >
                        Edit Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        className="h-7 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => void onRespond(review.id, "")}
                      >
                        Remove Reply
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className={vendorFeedbackViewsStyles.actionBtn}
                    size="sm"
                    variant="secondary"
                    type="button"
                    onClick={openRespond}
                  >
                    {LABELS.respondToReview}
                  </Button>
                )}
              </article>
            );
          })
        : null}

      {!isLoading && !loadError && !reviews.length ? (
        <p className={vendorFeedbackViewsStyles.emptyText}>
          {LABELS.noReviewsFound}
        </p>
      ) : null}

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
