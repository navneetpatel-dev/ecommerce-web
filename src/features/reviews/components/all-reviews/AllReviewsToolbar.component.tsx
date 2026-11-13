"use client";

import { ImageIcon } from "lucide-react";
import { FilterChip } from "@/shared/components/listing/FilterChip.component";
import {
  FilterChipGroup,
  type FilterChipOption,
} from "@/shared/components/listing/FilterChipGroup.component";
import { SortSelect } from "@/shared/components/listing/SortSelect.component";
import { LABELS } from "@/shared/constants/labels";
import { REVIEW_SORT_OPTIONS } from "../../constants/productReviews.constants";
import type { RatingFilterValue } from "../../hooks/all-reviews/useAllReviewsPage.hook";
import type { ReviewSort } from "../../types/productReviews.types";
import { productSubPageStyles as styles } from "@/shared/styles/layout/productSubPage.styles";

const RATING_FILTER_OPTIONS: readonly FilterChipOption<RatingFilterValue>[] = [
  { value: "all", label: LABELS.reviewFilterAll },
  { value: "5", label: "5 ★" },
  { value: "4", label: "4 ★" },
  { value: "3", label: "3 ★" },
  { value: "2", label: "2 ★" },
  { value: "1", label: "1 ★" },
];

interface AllReviewsToolbarProps {
  ratingFilter: RatingFilterValue;
  withMedia: boolean;
  sort: ReviewSort;
  onRatingChange: (value: RatingFilterValue) => void;
  onToggleWithMedia: () => void;
  onSortChange: (value: ReviewSort) => void;
}

/** Star chips + "With photos" on the left, sort on the right. */
export function AllReviewsToolbar({
  ratingFilter,
  withMedia,
  sort,
  onRatingChange,
  onToggleWithMedia,
  onSortChange,
}: AllReviewsToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarFilters}>
        <FilterChipGroup
          label={LABELS.reviewFilterStars}
          options={RATING_FILTER_OPTIONS}
          value={ratingFilter}
          onChange={onRatingChange}
        />
        <FilterChip pressed={withMedia} onPress={onToggleWithMedia}>
          <ImageIcon className={styles.chipIcon} aria-hidden />
          {LABELS.reviewFilterWithMedia}
        </FilterChip>
      </div>
      <SortSelect
        options={REVIEW_SORT_OPTIONS}
        value={sort}
        onChange={onSortChange}
      />
    </div>
  );
}
