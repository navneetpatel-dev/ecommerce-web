import { ThumbsDown, ThumbsUp } from "lucide-react";
import { RatingStars } from "@/shared/components/display/RatingStars.component";
import { Button } from "@/shared/components/ui/button";
import { REVIEW_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { Review } from "@/shared/api/types";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";
import { ReviewMediaGallery } from "../media/ReviewMediaGallery.component";

interface ProductReviewItemProps {
  review: Review;
  onVoteHelpful: () => void;
  onVoteUnhelpful: () => void;
}

export function ProductReviewItem({
  review,
  onVoteHelpful,
  onVoteUnhelpful,
}: ProductReviewItemProps) {
  return (
    <article className={styles.article}>
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

      {review.title && <h3 className={styles.reviewTitle}>{review.title}</h3>}

      <p className={styles.reviewBody}>{review.body}</p>
      <ReviewMediaGallery media={review.media} />

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
        <Button type="button" variant="ghost" size="sm" onClick={onVoteHelpful}>
          <ThumbsUp className={styles.voteIcon} /> {review.helpfulCount}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onVoteUnhelpful}
        >
          <ThumbsDown className={styles.voteIcon} /> {review.unhelpfulCount}
        </Button>
      </div>
    </article>
  );
}
