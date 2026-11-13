import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { RATING_VALUES } from "../constants/productReviews.constants";
import type {
  RatingRow,
  RatingValue,
  ReviewSort,
  ReviewSummary,
} from "../types/productReviews.types";

export const EMPTY_REVIEW_SUMMARY: ReviewSummary = {
  total: 0,
  average: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  withMedia: 0,
};

/** Reads `meta.summary` defensively — an older backend sends none. */
export function readReviewSummary(raw: unknown): ReviewSummary {
  if (!raw || typeof raw !== "object") return EMPTY_REVIEW_SUMMARY;
  const value = raw as Partial<ReviewSummary>;
  return {
    total: Number(value.total ?? 0),
    average: Number(value.average ?? 0),
    distribution: {
      ...EMPTY_REVIEW_SUMMARY.distribution,
      ...value.distribution,
    },
    withMedia: Number(value.withMedia ?? 0),
  };
}

/** Five bars, 5★ first, as whole percentages of all reviews. */
export function buildRatingRows(summary: ReviewSummary): RatingRow[] {
  return RATING_VALUES.map((rating) => {
    const count = summary.distribution[rating] ?? 0;
    return {
      rating,
      count,
      percent: summary.total ? Math.round((count / summary.total) * 100) : 0,
    };
  });
}

export function formatReviewAverage(average: number): string {
  return average.toFixed(1);
}

export function reviewCountLabel(total: number): string {
  return total === 1
    ? LABELS.reviewsBasedOnOne
    : formatLabel(LABELS.reviewsBasedOn, {
        count: total.toLocaleString("en-IN"),
      });
}

export function parseRating(raw: string | null): RatingValue | undefined {
  const value = Number(raw);
  return RATING_VALUES.includes(value as RatingValue)
    ? (value as RatingValue)
    : undefined;
}

const SORTS: readonly ReviewSort[] = ["helpful", "recent", "highest", "lowest"];
export function parseReviewSort(raw: string | null): ReviewSort | undefined {
  return SORTS.includes(raw as ReviewSort) ? (raw as ReviewSort) : undefined;
}

/** Up to two initials for the reviewer avatar. */
export function reviewerInitials(name: string | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

const STATUS_TEXT: Record<string, string> = {
  PENDING: LABELS.reviewStatusPending,
  APPROVED: LABELS.reviewStatusApproved,
  REJECTED: LABELS.reviewStatusRejected,
};

/** "Awaiting approval" / "Published" / "Not published" instead of the raw enum. */
export function reviewStatusText(status: string): string {
  return STATUS_TEXT[status] ?? status;
}
