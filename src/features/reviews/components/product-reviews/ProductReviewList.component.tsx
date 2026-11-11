import type { Review } from "@/shared/api/types";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";
import { ProductReviewItem } from "./ProductReviewItem.component";

interface ProductReviewListProps {
  reviews: Review[];
  onVoteHelpful: (reviewId: string) => void;
  onVoteUnhelpful: (reviewId: string) => void;
}

export function ProductReviewList({
  reviews,
  onVoteHelpful,
  onVoteUnhelpful,
}: ProductReviewListProps) {
  const voteHelpful = (reviewId: string) => () => onVoteHelpful(reviewId);
  const voteUnhelpful = (reviewId: string) => () => onVoteUnhelpful(reviewId);

  return (
    <div className={styles.list}>
      {reviews.map((review) => (
        <ProductReviewItem
          key={review.id}
          review={review}
          onVoteHelpful={voteHelpful(review.id)}
          onVoteUnhelpful={voteUnhelpful(review.id)}
        />
      ))}
    </div>
  );
}
