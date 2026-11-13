import { LABELS } from "@/shared/constants/labels";
import type { FilterChipOption } from "@/shared/components/listing/FilterChipGroup.component";
import type { RatingValue, ReviewSort } from "../types/productReviews.types";

/** The PDP shows only the most helpful few; the rest live on the "all reviews" page. */
export const PDP_REVIEW_PREVIEW_LIMIT = 5;
export const ALL_REVIEWS_PAGE_LIMIT = 10;
/** Reviews longer than this start clamped to four lines with "Read more". */
export const REVIEW_CLAMP_CHARS = 360;
export const DEFAULT_REVIEW_SORT: ReviewSort = "helpful";

export const RATING_VALUES: readonly RatingValue[] = [5, 4, 3, 2, 1];

export const REVIEW_SORT_OPTIONS: readonly FilterChipOption<ReviewSort>[] = [
  { value: "helpful", label: LABELS.reviewSortHelpful },
  { value: "recent", label: LABELS.reviewSortRecent },
  { value: "highest", label: LABELS.reviewSortHighest },
  { value: "lowest", label: LABELS.reviewSortLowest },
];

/** URL query keys on the all-reviews page. */
export const REVIEW_QUERY = {
  page: "page",
  rating: "rating",
  media: "media",
  sort: "sort",
} as const;
