import type { ReactNode } from "react";
import { RatingStars } from "@/shared/components/display/RatingStars.component";
import { LABELS } from "@/shared/constants/labels";
import type {
  RatingValue,
  ReviewSummary,
} from "../../types/productReviews.types";
import {
  buildRatingRows,
  formatReviewAverage,
  reviewCountLabel,
} from "../../utils/productReviews.utils";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";
import { RatingDistributionList } from "./RatingDistributionList.component";

interface ReviewSummaryCardProps {
  summary: ReviewSummary;
  ratingHref: (rating: RatingValue) => string;
  activeRating?: RatingValue;
  footer?: ReactNode;
}

/** Average, star count and a clickable 5→1 breakdown. */
export function ReviewSummaryCard({
  summary,
  ratingHref,
  activeRating,
  footer,
}: ReviewSummaryCardProps) {
  return (
    <section aria-label={LABELS.customerReviews} className={styles.summaryCard}>
      <p className={styles.summaryEyebrow}>{LABELS.customerReviews}</p>
      <div className={styles.averageRow}>
        <span className={styles.averageValue}>
          {formatReviewAverage(summary.average)}
        </span>
        <div className={styles.averageMeta}>
          <RatingStars value={summary.average} size="md" />
          <p className={styles.countText}>{reviewCountLabel(summary.total)}</p>
        </div>
      </div>
      <RatingDistributionList
        rows={buildRatingRows(summary)}
        ratingHref={ratingHref}
        activeRating={activeRating}
      />
      {footer ? <div className={styles.summaryFooter}>{footer}</div> : null}
    </section>
  );
}
