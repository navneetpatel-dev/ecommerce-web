import type { Review } from "@/shared/api/types";
import { ProductReviewItem } from "./ProductReviewItem.component";

interface PinnedMyReviewProps {
  review: Review | null;
  onVoteHelpful: (reviewId: string) => void;
  onVoteUnhelpful: (reviewId: string) => void;
}

/** The viewer's own review, always first (even while it awaits approval). */
export function PinnedMyReview({
  review,
  onVoteHelpful,
  onVoteUnhelpful,
}: PinnedMyReviewProps) {
  if (!review) return null;
  const handleHelpful = () => onVoteHelpful(review.id);
  const handleUnhelpful = () => onVoteUnhelpful(review.id);
  return (
    <ProductReviewItem
      review={review}
      pinned
      onVoteHelpful={handleHelpful}
      onVoteUnhelpful={handleUnhelpful}
    />
  );
}
