"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { ReviewVote } from "@/shared/api/types";
import { useVoteReview } from "../../api/reviews/reviews.queries";
import { findReviewInCaches } from "../../api/reviews/reviewCache";
import { nextVote } from "../../utils/reviewVotes.utils";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";

/**
 * Helpful / not-helpful votes, gated behind sign-in (the prompt brings them
 * back here). Clicking the vote you already gave takes it back.
 */
export function useReviewVoting() {
  const queryClient = useQueryClient();
  const voteReview = useVoteReview();
  const { requireAuth } = useRequireAuth();

  const vote = (reviewId: string, clicked: ReviewVote) => {
    if (
      !requireAuth({
        title: "Vote on reviews",
        message: "Sign in to mark reviews as helpful or unhelpful.",
      })
    ) {
      return;
    }
    const current = findReviewInCaches(queryClient, reviewId)?.myVote;
    voteReview.mutate({ reviewId, vote: nextVote(current, clicked) });
  };

  return {
    voteHelpful: (reviewId: string) => vote(reviewId, "HELPFUL"),
    voteUnhelpful: (reviewId: string) => vote(reviewId, "UNHELPFUL"),
  };
}
