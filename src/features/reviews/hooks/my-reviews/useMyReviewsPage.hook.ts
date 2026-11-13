"use client";

import { flattenPages } from "@/shared/api/client/pagination";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  useAwaitingReviews,
  useMyReviews,
} from "../../api/reviews/reviews.queries";

/** The shopper's reviews (infinite) plus how many deliveries still await one. */
export function useMyReviewsPage() {
  const reviewsQuery = useMyReviews();
  const awaitingQuery = useAwaitingReviews();
  const awaiting = awaitingQuery.data?.pages[0]?.total ?? 0;

  return {
    reviews: flattenPages(reviewsQuery.data),
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    error: reviewsQuery.error,
    retry: () => void reviewsQuery.refetch(),
    hasNextPage: reviewsQuery.hasNextPage,
    isFetchingNextPage: reviewsQuery.isFetchingNextPage,
    loadMore: () => void reviewsQuery.fetchNextPage(),
    awaitingCount: awaiting,
    awaitingLabel:
      awaiting === 1
        ? LABELS.awaitingReviewsBannerOne
        : formatLabel(LABELS.awaitingReviewsBanner, {
            count: awaiting.toLocaleString("en-IN"),
          }),
  };
}
