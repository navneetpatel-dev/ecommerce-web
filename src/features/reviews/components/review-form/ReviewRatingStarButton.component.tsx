"use client";

import { useCallback } from "react";
import { Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { cn } from "@/shared/utils/dom/cn";
import { reviewFormStyles as styles } from "../../styles/review-form/reviewForm.styles";

interface ReviewRatingStarButtonProps {
  value: number;
  active: boolean;
  pressed: boolean;
  onSelect: (value: number) => void;
  onHover: (value: number) => void;
}

/** One star of the rating picker — named for assistive tech, pressed when chosen. */
export function ReviewRatingStarButton({
  value,
  active,
  pressed,
  onSelect,
  onHover,
}: ReviewRatingStarButtonProps) {
  const handleClick = useCallback(() => onSelect(value), [onSelect, value]);
  const handleMouseEnter = useCallback(() => onHover(value), [onHover, value]);
  const handleMouseLeave = useCallback(() => onHover(0), [onHover]);

  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={formatLabel(LABELS.rateStar, { count: value })}
      aria-pressed={pressed}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={styles.starButton}
    >
      <Star
        className={cn(
          styles.starIcon,
          active ? styles.starActive : styles.starInactive,
        )}
      />
    </Button>
  );
}
