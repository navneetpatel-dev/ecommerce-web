"use client";

import { flattenPages } from "@/shared/api/client/pagination";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useAwaitingReviews } from "../../api/reviews/reviews.queries";

/** Delivered, unreviewed products, a page at a time as the shopper scrolls. */
export function useAwaitingReviewsPage() {
  const query = useAwaitingReviews();
  const items = flattenPages(query.data);
  const total = query.data?.pages[0]?.total ?? 0;

  return {
    items,
    total,
    countLabel: formatLabel(LABELS.awaitingCount, {
      count: total.toLocaleString("en-IN"),
    }),
    isLoading: query.isLoading,
    isError: query.isError && !query.data,
    error: query.error,
    retry: () => void query.refetch(),
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    loadMore: () => void query.fetchNextPage(),
  };
}
