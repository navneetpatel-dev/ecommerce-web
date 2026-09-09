"use client";

import { useProductReviews, useVoteReview } from "../../api/reviews/reviews.queries";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";
import type { Review } from "@/shared/api/types";

export function useProductReviewsView(
  productId: string,
  options: { enabled?: boolean } = {},
) {
  const { data: reviews, isLoading } = useProductReviews(productId, options);
  const voteReview = useVoteReview();
  const { requireAuth } = useRequireAuth();

  const vote = (reviewId: string, vote: "HELPFUL" | "UNHELPFUL") => {
    if (
      !requireAuth({
        title: "Vote on reviews",
        message: "Sign in to mark reviews as helpful or unhelpful.",
      })
    ) {
      return;
    }
    voteReview.mutate({ reviewId, vote });
  };

  return {
    reviews: (reviews ?? []) as Review[],
    isLoading,
    voteHelpful: (reviewId: string) => vote(reviewId, "HELPFUL"),
    voteUnhelpful: (reviewId: string) => vote(reviewId, "UNHELPFUL"),
  };
}
