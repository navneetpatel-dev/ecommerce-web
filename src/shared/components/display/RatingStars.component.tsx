import { Star } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { ratingStarsStyles } from "./displayComponents.styles";

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
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.25 && value - fullStars < 0.75;
  const adjustedFull = value - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const starSize =
    size === "md" ? ratingStarsStyles.sizeMd : ratingStarsStyles.sizeSm;
  const stars = [1, 2, 3, 4, 5].map((i) =>
    starElement(i, adjustedFull, hasHalf, starSize),
  );
  const countElement = count !== undefined && (
    <span className={ratingStarsStyles.count}>({count})</span>
  );

  return (
    <div className={ratingStarsStyles.container}>
      <div className={ratingStarsStyles.starsRow}>{stars}</div>
      {countElement}
    </div>
  );
}
