import type { RatingRow, RatingValue } from "../../types/productReviews.types";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";
import { RatingDistributionRow } from "./RatingDistributionRow.component";

interface RatingDistributionListProps {
  rows: RatingRow[];
  ratingHref: (rating: RatingValue) => string;
  activeRating?: RatingValue;
}

export function RatingDistributionList({
  rows,
  ratingHref,
  activeRating,
}: RatingDistributionListProps) {
  return (
    <div className={styles.distribution}>
      {rows.map((row) => (
        <RatingDistributionRow
          key={row.rating}
          row={row}
          href={ratingHref(row.rating)}
          active={row.rating === activeRating}
        />
      ))}
    </div>
  );
}
