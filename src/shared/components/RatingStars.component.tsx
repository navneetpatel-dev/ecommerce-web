import { Star } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface RatingStarsProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
}

export function RatingStars({ value, count, size = "sm" }: RatingStarsProps) {
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.25 && value - fullStars < 0.75;
  const adjustedFull = value - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const starSize = size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          if (i <= adjustedFull) {
            return (
              <Star
                key={i}
                className={cn(starSize, "fill-warning text-warning")}
              />
            );
          }
          if (i === adjustedFull + 1 && hasHalf) {
            return (
              <span key={i} className="relative">
                <Star className={cn(starSize, "fill-none text-line")} />
                <span className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className={cn(starSize, "fill-warning text-warning")} />
                </span>
              </span>
            );
          }
          return (
            <Star key={i} className={cn(starSize, "fill-none text-line")} />
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-body-sm text-ink-muted">({count})</span>
      )}
    </div>
  );
}
