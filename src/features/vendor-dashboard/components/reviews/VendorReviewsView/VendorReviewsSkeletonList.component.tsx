"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { vendorFeedbackViewsStyles as styles } from "../../../styles/reviews/vendorFeedbackViews.styles";

const SKELETON_KEYS = [
  "rev-skeleton-1",
  "rev-skeleton-2",
  "rev-skeleton-3",
] as const;

export function VendorReviewsSkeletonList() {
  return (
    <div className={styles.loadingStack} aria-busy="true" aria-live="polite">
      {SKELETON_KEYS.map((key) => (
        <Skeleton key={key} className={styles.skeleton} />
      ))}
    </div>
  );
}
