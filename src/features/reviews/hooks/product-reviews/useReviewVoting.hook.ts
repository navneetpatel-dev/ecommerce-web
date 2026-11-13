"use client";

import { useVoteReview } from "../../api/reviews/reviews.queries";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";

type Vote = "HELPFUL" | "UNHELPFUL";

/** Helpful / not-helpful votes, gated behind sign-in (the prompt brings them back here). */
export function useReviewVoting() {
  const voteReview = useVoteReview();
  const { requireAuth } = useRequireAuth();

  const vote = (reviewId: string, value: Vote) => {
    if (
      !requireAuth({
        title: "Vote on reviews",
        message: "Sign in to mark reviews as helpful or unhelpful.",
      })
    ) {
      return;
    }
    voteReview.mutate({ reviewId, vote: value });
  };

  return {
    voteHelpful: (reviewId: string) => vote(reviewId, "HELPFUL"),
    voteUnhelpful: (reviewId: string) => vote(reviewId, "UNHELPFUL"),
  };
}
