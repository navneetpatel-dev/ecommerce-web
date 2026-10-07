"use client";

import { LABELS } from "@/shared/constants/labels";
import { ReviewRatingStarButton } from "./ReviewRatingStarButton.component";
import { reviewFormStyles as styles } from "../../styles/review-form/reviewForm.styles";

const RATING_VALUES = [1, 2, 3, 4, 5] as const;

interface ReviewRatingStarsProps {
  rating: number;
  hoverRating: number;
  onSetRating: (value: number) => void;
  onSetHoverRating: (value: number) => void;
}

/**
 * 1–5 star picker. Grouped toggle buttons (AGENTS rule: role="group" +
 * aria-pressed), each star named via LABELS so screen readers announce the
 * exact rating on offer.
 */
export function ReviewRatingStars({
  rating,
  hoverRating,
  onSetRating,
  onSetHoverRating,
}: ReviewRatingStarsProps) {
  const highlighted = hoverRating || rating;

  return (
    <div
      role="group"
      aria-label={LABELS.rating}
      className={styles.starsContainer}
    >
      {RATING_VALUES.map((value) => (
        <ReviewRatingStarButton
          key={value}
          value={value}
          active={value <= highlighted}
          pressed={value <= rating}
          onSelect={onSetRating}
          onHover={onSetHoverRating}
        />
      ))}
    </div>
  );
}
