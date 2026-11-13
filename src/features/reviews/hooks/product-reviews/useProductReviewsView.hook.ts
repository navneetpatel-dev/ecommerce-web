"use client";

import { useProductReviews } from "../../api/reviews/reviews.queries";
import { PATHS } from "@/shared/constants/paths/paths";
import { withQuery } from "@/shared/api/client/pagination";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  DEFAULT_REVIEW_SORT,
  PDP_REVIEW_PREVIEW_LIMIT,
  REVIEW_QUERY,
} from "../../constants/productReviews.constants";
import { EMPTY_REVIEW_SUMMARY } from "../../utils/productReviews.utils";
import type { RatingValue } from "../../types/productReviews.types";
import { useReviewVoting } from "./useReviewVoting.hook";

const PREVIEW_PARAMS = {
  limit: PDP_REVIEW_PREVIEW_LIMIT,
  sort: DEFAULT_REVIEW_SORT,
} as const;

/** PDP reviews: the star summary plus the few most helpful reviews. */
export function useProductReviewsView(
  productId: string,
  productSlug: string,
  options: { enabled?: boolean } = {},
) {
  const query = useProductReviews(productId, PREVIEW_PARAMS, options);
  const voting = useReviewVoting();
  const summary = query.data?.summary ?? EMPTY_REVIEW_SUMMARY;
  const allReviewsHref = PATHS.productReviews(productSlug);

  const retry = () => {
    void query.refetch();
  };

  return {
    // The viewer's own review is pinned on top, so it is not repeated in the list.
    myReview: query.data?.myReview ?? null,
    reviews: (query.data?.items ?? []).filter(
      (review) => review.id !== query.data?.myReview?.id,
    ),
    summary,
    isLoading: query.isLoading,
    // A failed load must not read as "No reviews yet".
    isError: query.isError && !query.data,
    retry,
    allReviewsHref,
    viewAllLabel: formatLabel(LABELS.viewAllReviews, {
      count: summary.total.toLocaleString("en-IN"),
    }),
    hasMore: summary.total > PDP_REVIEW_PREVIEW_LIMIT,
    ratingHref: (rating: RatingValue) =>
      withQuery(allReviewsHref, { [REVIEW_QUERY.rating]: rating }),
    voteHelpful: voting.voteHelpful,
    voteUnhelpful: voting.voteUnhelpful,
  };
}
