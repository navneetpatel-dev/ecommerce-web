import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { PaginatedList } from "@/shared/api/client/pagination";
import type { Review } from "@/shared/api/types";
import { REVIEW_STATUS } from "@/shared/constants/statuses";
import type {
  ProductReviewPage,
  RatingValue,
  ReviewSummary,
} from "../../types/productReviews.types";

/** Returns the new review, or null to remove it. */
export type ReviewUpdate = (review: Review) => Review | null;

const ALL_REVIEWS = ["reviews"] as const;

function isReviewPage(data: unknown): data is ProductReviewPage {
  return Boolean(
    data &&
    typeof data === "object" &&
    Array.isArray((data as ProductReviewPage).items) &&
    "summary" in (data as object),
  );
}

function isInfiniteReviews(
  data: unknown,
): data is InfiniteData<PaginatedList<Review>> {
  return Boolean(
    data &&
    typeof data === "object" &&
    Array.isArray((data as InfiniteData<unknown>).pages),
  );
}

/** An approved review leaving the public set takes its stars out of the summary. */
function withoutFromSummary(
  summary: ReviewSummary,
  review: Review,
): ReviewSummary {
  if (review.status !== REVIEW_STATUS.APPROVED || summary.total <= 0)
    return summary;
  const rating = review.rating as RatingValue;
  const total = summary.total - 1;
  return {
    ...summary,
    total,
    average: total
      ? Math.round(((summary.average * summary.total - rating) / total) * 10) /
        10
      : 0,
    distribution: {
      ...summary.distribution,
      [rating]: Math.max(0, (summary.distribution[rating] ?? 0) - 1),
    },
    withMedia: review.media?.length
      ? Math.max(0, summary.withMedia - 1)
      : summary.withMedia,
  };
}

/** Patches one list in place; `removed` is the original when the update deleted it. */
function patchItems(items: Review[], reviewId: string, update: ReviewUpdate) {
  let removed: Review | null = null;
  const next = items.flatMap((review) => {
    if (review.id !== reviewId) return [review];
    const updated = update(review);
    if (!updated) removed = review;
    return updated ? [updated] : [];
  });
  return { items: next, removed: removed as Review | null };
}

/**
 * Applies an edit / vote / delete to every cached copy of a review — the PDP
 * preview, the all-reviews pages, the pinned "your review" and My Reviews — in
 * place. Nothing is refetched, so nothing else on screen moves: a vote does not
 * re-rank "Most helpful", an edit (now pending) does not vanish from where the
 * shopper is looking. Fresh ordering comes with the next visit.
 */
export function updateReviewInCaches(
  queryClient: QueryClient,
  reviewId: string,
  update: ReviewUpdate,
): void {
  queryClient.setQueriesData({ queryKey: ALL_REVIEWS }, (data: unknown) => {
    if (isReviewPage(data)) {
      const { items, removed } = patchItems(data.items, reviewId, update);
      const mine =
        data.myReview?.id === reviewId ? update(data.myReview) : data.myReview;
      const gone =
        removed ??
        (data.myReview?.id === reviewId && !mine ? data.myReview : null);
      return {
        ...data,
        items,
        myReview: mine,
        total: removed ? Math.max(0, data.total - 1) : data.total,
        summary: gone ? withoutFromSummary(data.summary, gone) : data.summary,
      };
    }
    if (isInfiniteReviews(data)) {
      return {
        ...data,
        pages: data.pages.map((page) => {
          const { items, removed } = patchItems(page.items, reviewId, update);
          return {
            ...page,
            items,
            total: removed ? Math.max(0, page.total - 1) : page.total,
          };
        }),
      };
    }
    return data;
  });
}
