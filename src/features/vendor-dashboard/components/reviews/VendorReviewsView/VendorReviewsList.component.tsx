"use client";

import type { Review } from "@/shared/api/types";
import { VendorReviewCard } from "./VendorReviewCard.component";
import { vendorFeedbackViewsStyles as styles } from "../../../styles/reviews/vendorFeedbackViews.styles";

interface VendorReviewsListProps {
  reviews: Review[];
  onOpenRespond: (reviewId: string) => void;
  onOpenFlag: (reviewId: string) => void;
  onRemoveReply: (reviewId: string) => void;
  canFlag: boolean;
}

export function VendorReviewsList({
  reviews,
  onOpenRespond,
  onOpenFlag,
  onRemoveReply,
  canFlag,
}: VendorReviewsListProps) {
  return (
    <div className={styles.loadingStack}>
      {reviews.map((review) => (
        <VendorReviewCard
          key={review.id}
          review={review}
          onOpenRespond={onOpenRespond}
          onOpenFlag={onOpenFlag}
          onRemoveReply={onRemoveReply}
          canFlag={canFlag}
        />
      ))}
    </div>
  );
}
