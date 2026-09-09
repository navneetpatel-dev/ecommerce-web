import { ThumbsDown, ThumbsUp, MessageSquare } from "lucide-react";
import { RatingStars } from "@/shared/components/RatingStars.component";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Button } from "@/shared/components/ui/button";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { REVIEW_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { Review } from "@/shared/api/types";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";

interface ProductReviewsProps {
  reviews: Review[];
  isLoading?: boolean;
  onVoteHelpful: (reviewId: string) => void;
  onVoteUnhelpful: (reviewId: string) => void;
}

export function ProductReviews({
  reviews,
  isLoading,
  onVoteHelpful,
  onVoteUnhelpful,
}: ProductReviewsProps) {
  if (isLoading) {
    return <ReviewListSkeleton count={3} />;
  }

  if (!reviews.length) {
    return (
      <EmptyState
        heading="No reviews yet"
        message="Be the first to review this product after purchase."
        icon={MessageSquare}
        maxWidth="max-w-[65ch]"
        className={styles.emptyClass}
      />
    );
  }

  return (
    <div className={styles.list}>
      {reviews.map((review) => (
        <article key={review.id} className={styles.article}>
          <div className={styles.header}>
            <div className={styles.userGroup}>
              <p className={styles.userName}>
                {review.user?.name ?? "Verified buyer"}
              </p>
              <RatingStars value={review.rating} size="sm" />
            </div>
            {review.status === REVIEW_STATUS.APPROVED && (
              <span className={styles.verifiedBadge}>Verified Purchase</span>
            )}
          </div>

          {review.title && (
            <h3 className={styles.reviewTitle}>{review.title}</h3>
          )}

          <p className={styles.reviewBody}>{review.body}</p>

          {review.vendorResponse ? (
            <div className={styles.sellerResponse}>
              <p className={styles.sellerTitle}>
                Seller response
                {review.vendorRespondedAt ? (
                  <span className={styles.sellerDate}>
                    {formatOrderDate(review.vendorRespondedAt)}
                  </span>
                ) : null}
              </p>
              <p className={styles.sellerBody}>{review.vendorResponse}</p>
            </div>
          ) : null}

          <div className={styles.voteRow}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onVoteHelpful(review.id)}
            >
              <ThumbsUp className={styles.voteIcon} /> {review.helpfulCount}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onVoteUnhelpful(review.id)}
            >
              <ThumbsDown className={styles.voteIcon} /> {review.unhelpfulCount}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
