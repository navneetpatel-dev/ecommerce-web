import Link from "next/link";
import { Star } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { RatingRow } from "../../types/productReviews.types";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";

interface RatingDistributionRowProps {
  row: RatingRow;
  href: string;
  active: boolean;
}

/** "5★ ▇▇▇▇▇░ 47" — a link that filters the reviews to that star rating. */
export function RatingDistributionRow({
  row,
  href,
  active,
}: RatingDistributionRowProps) {
  const label = formatLabel(LABELS.ratingRowLabel, {
    rating: row.rating,
    count: row.count,
    percent: row.percent,
  });

  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      aria-current={active ? "true" : undefined}
      className={cn(styles.distRow, active && styles.distRowActive)}
    >
      <span className={styles.distLabel} aria-hidden>
        {row.rating}
        <Star className={styles.distStar} />
      </span>
      <span className={styles.distTrack} aria-hidden>
        <span
          className={styles.distFill}
          style={{ width: `${row.percent}%` }}
        />
      </span>
      <span className={styles.distCount} aria-hidden>
        {row.count}
      </span>
    </Link>
  );
}
