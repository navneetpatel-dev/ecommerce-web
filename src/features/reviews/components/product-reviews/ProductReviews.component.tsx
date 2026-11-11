import { AlertTriangle, MessageSquare } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import type { Review } from "@/shared/api/types";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";
import { ProductReviewList } from "./ProductReviewList.component";

interface ProductReviewsProps {
  reviews: Review[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onVoteHelpful: (reviewId: string) => void;
  onVoteUnhelpful: (reviewId: string) => void;
}

export function ProductReviews({
  reviews,
  isLoading,
  isError,
  onRetry,
  onVoteHelpful,
  onVoteUnhelpful,
}: ProductReviewsProps) {
  if (isLoading) {
    return <ReviewListSkeleton count={3} />;
  }

  if (isError) {
    return (
      <EmptyState
        heading="Reviews could not be loaded"
        message="Something went wrong on our side. Try again in a moment."
        icon={AlertTriangle}
        actionLabel="Try again"
        onAction={onRetry}
        maxWidth={styles.stateMaxWidth}
        className={styles.emptyClass}
      />
    );
  }

  if (!reviews.length) {
    return (
      <EmptyState
        heading="No reviews yet"
        message="After an order is delivered, you can leave a review from the order page."
        icon={MessageSquare}
        maxWidth={styles.stateMaxWidth}
        className={styles.emptyClass}
      />
    );
  }

  return (
    <ProductReviewList
      reviews={reviews}
      onVoteHelpful={onVoteHelpful}
      onVoteUnhelpful={onVoteUnhelpful}
    />
  );
}
