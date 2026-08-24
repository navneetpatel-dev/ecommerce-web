import { ThumbsDown, ThumbsUp, MessageSquare } from "lucide-react";
import { RatingStars } from "@/shared/components/RatingStars.component";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Button } from "@/shared/components/ui/button";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { REVIEW_STATUS } from "@/shared/constants/statuses";
import type { Review } from "@/shared/api/types";

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
        className="px-0 py-8"
      />
    );
  }

  return (
    <div className="max-w-[65ch] divide-y divide-line">
      {reviews.map((review) => (
        <article key={review.id} className="py-6 first:pt-0">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-body font-medium text-ink">
                {review.user?.name ?? "Verified buyer"}
              </p>
              <RatingStars value={review.rating} size="sm" />
            </div>
            {review.status === REVIEW_STATUS.APPROVED && (
              <span className="rounded-sm bg-success-subtle px-2 py-1 text-body-sm font-medium text-success">
                Verified Purchase
              </span>
            )}
          </div>

          {review.title && (
            <h3 className="mt-4 text-[1.125rem] font-semibold text-ink">
              {review.title}
            </h3>
          )}

          <p className="mt-2 text-body leading-relaxed text-ink-muted whitespace-pre-wrap">
            {review.body}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onVoteHelpful(review.id)}
            >
              <ThumbsUp className="h-4 w-4" /> {review.helpfulCount}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onVoteUnhelpful(review.id)}
            >
              <ThumbsDown className="h-4 w-4" /> {review.unhelpfulCount}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
