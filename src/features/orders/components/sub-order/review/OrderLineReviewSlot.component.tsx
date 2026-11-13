import Link from "next/link";
import { Star } from "lucide-react";
import type { OrderItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { cn } from "@/shared/utils/dom/cn";
import {
  isReviewableLine,
  reviewStatusLabel,
} from "../../../utils/sub-order/orderLineReview.utils";
import { SUB_ORDER_CARD_ITEMS_STYLES as styles } from "../../../styles/sub-order/subOrderCardItems.styles";

interface OrderLineReviewSlotProps {
  item: OrderItem;
  onWriteReview: () => void;
}

/** Under a delivered line: "Write a review", or the review already left for it. */
export function OrderLineReviewSlot({
  item,
  onWriteReview,
}: OrderLineReviewSlotProps) {
  if (item.review) {
    return (
      <p className={cn(styles.lineActions, styles.reviewStatus)}>
        <span className={styles.reviewStatusStrong}>
          {formatLabel(LABELS.yourReviewRating, { rating: item.review.rating })}
        </span>
        <span aria-hidden>·</span>
        <span>{reviewStatusLabel(item.review.status)}</span>
        <Link href={PATHS.reviews} className={styles.reviewLink}>
          {LABELS.viewYourReviews}
        </Link>
      </p>
    );
  }

  if (!isReviewableLine(item)) return null;

  return (
    <div className={styles.lineActions}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={styles.reviewButton}
        onClick={onWriteReview}
      >
        <Star className={styles.reviewIcon} aria-hidden />
        {LABELS.writeAReview}
      </Button>
    </div>
  );
}
