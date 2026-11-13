import type { Review, ReviewVote } from "@/shared/api/types";

/** The vote a click leads to: the same vote again takes it back. */
export function nextVote(
  current: ReviewVote | null | undefined,
  clicked: ReviewVote,
): ReviewVote | null {
  return current === clicked ? null : clicked;
}

/** The review as it reads once the viewer's vote is `next` (shown before the server answers). */
export function withViewerVote(
  review: Review,
  next: ReviewVote | null,
): Review {
  const previous = review.myVote ?? null;
  const delta = (vote: ReviewVote) =>
    (next === vote ? 1 : 0) - (previous === vote ? 1 : 0);
  return {
    ...review,
    myVote: next,
    helpfulCount: Math.max(0, review.helpfulCount + delta("HELPFUL")),
    unhelpfulCount: Math.max(0, review.unhelpfulCount + delta("UNHELPFUL")),
  };
}
