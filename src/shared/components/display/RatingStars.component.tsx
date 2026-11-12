import { Star } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { cn } from "@/shared/utils/dom/cn";
import { ratingStarsStyles } from "../../styles/display/displayComponents.styles";

interface RatingStarsProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
}

function starElement(
  i: number,
  adjustedFull: number,
  hasHalf: boolean,
  starSize: string,
) {
  if (i <= adjustedFull) {
    return (
      <Star key={i} className={cn(starSize, ratingStarsStyles.starFill)} />
    );
  }
  if (i === adjustedFull + 1 && hasHalf) {
    return (
      <span key={i} className={ratingStarsStyles.halfWrap}>
        <Star className={cn(starSize, ratingStarsStyles.starEmpty)} />
        <span className={ratingStarsStyles.halfOverlay}>
          <Star className={cn(starSize, ratingStarsStyles.starFill)} />
        </span>
      </span>
    );
  }
  return <Star key={i} className={cn(starSize, ratingStarsStyles.starEmpty)} />;
}

export function RatingStars({ value, count, size = "sm" }: RatingStarsProps) {
  const noReviews = count === 0;
  const shownValue = noReviews ? 0 : value;
  const fullStars = Math.floor(shownValue);
  const hasHalf =
    shownValue - fullStars >= 0.25 && shownValue - fullStars < 0.75;
  const adjustedFull =
    shownValue - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const starSize =
    size === "md" ? ratingStarsStyles.sizeMd : ratingStarsStyles.sizeSm;
  const stars = [1, 2, 3, 4, 5].map((i) =>
    starElement(i, adjustedFull, hasHalf, starSize),
  );
  const countElement = noReviews ? (
    // aria-hidden: the screen-reader line above already says it (B-29: read twice).
    <span className={ratingStarsStyles.count} aria-hidden>
      {LABELS.noReviewsYet}
    </span>
  ) : (
    count !== undefined && (
      <span className={ratingStarsStyles.count}>({count})</span>
    )
  );

  return (
    <div className={ratingStarsStyles.container}>
      {/* The visual stars convey nothing to assistive tech: announce the value. */}
      <span className={ratingStarsStyles.srOnly}>
        {noReviews
          ? LABELS.noReviewsYet
          : formatLabel(LABELS.ratingOutOfFive, {
              value: shownValue.toFixed(1),
            })}
      </span>
      <div className={ratingStarsStyles.starsRow} aria-hidden>
        {stars}
      </div>
      {countElement}
    </div>
  );
}
