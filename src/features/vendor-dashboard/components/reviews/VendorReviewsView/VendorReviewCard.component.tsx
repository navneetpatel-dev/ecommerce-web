"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import type { Review } from "@/shared/api/types";
import { vendorFeedbackViewsStyles as styles } from "../../../styles/reviews/vendorFeedbackViews.styles";

interface VendorReviewCardProps {
  review: Review;
  onOpenRespond: (reviewId: string) => void;
  onOpenFlag: (reviewId: string) => void;
  onRemoveReply: (reviewId: string) => void;
  canFlag: boolean;
}

export function VendorReviewCard({
  review,
  onOpenRespond,
  onOpenFlag,
  onRemoveReply,
  canFlag,
}: VendorReviewCardProps) {
  const handleOpenRespond = () => onOpenRespond(review.id);
  const handleOpenFlag = () => onOpenFlag(review.id);
  const handleRemoveReply = () => onRemoveReply(review.id);

  const reviewTitle = review.title?.trim() || LABELS.reviewUntitled;
  const ratingText = formatLabel(LABELS.reviewRatingOutOf, {
    rating: String(review.rating),
  });

  return (
    <article className={styles.card}>
      <div className={styles.reviewHeader}>
        <div>
          <p className={styles.cardTitle}>
            {reviewTitle} · {ratingText}
          </p>
          {review.product?.name ? (
            <p className={styles.cardSubtitle}>{review.product.name}</p>
          ) : null}
        </div>
        {review.flaggedReason ? (
          <span className={styles.flaggedBadge}>Flagged for Moderation</span>
        ) : canFlag ? (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            className={styles.flagButton}
            onClick={handleOpenFlag}
          >
            Flag Review
          </Button>
        ) : null}
      </div>

      <p className={styles.cardBody}>{review.body}</p>

      {review.vendorResponse ? (
        <div className={styles.replyBox}>
          <div className={styles.replyHeader}>
            <span className={styles.replyTitle}>Your Seller Reply:</span>
            {review.vendorRespondedAt ? (
              <span>{formatDate(review.vendorRespondedAt)}</span>
            ) : null}
          </div>
          <p className={styles.replyBody}>{review.vendorResponse}</p>
          <div className={styles.replyActions}>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleOpenRespond}
              className={styles.editReplyBtn}
            >
              Edit Reply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className={styles.removeReplyBtn}
              onClick={handleRemoveReply}
            >
              Remove Reply
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className={styles.actionBtn}
          size="sm"
          variant="secondary"
          type="button"
          onClick={handleOpenRespond}
        >
          {LABELS.respondToReview}
        </Button>
      )}
    </article>
  );
}
