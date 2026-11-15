"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { vendorFeedbackViewsStyles as styles } from "../../../styles/reviews/vendorFeedbackViews.styles";

const SKELETON_KEYS = [
  "qna-skeleton-1",
  "qna-skeleton-2",
  "qna-skeleton-3",
] as const;

export function VendorQnaSkeletonList() {
  return (
    <div className={styles.loadingStack} aria-busy="true" aria-live="polite">
      {SKELETON_KEYS.map((key) => (
        <Skeleton key={key} className={styles.skeleton} />
      ))}
    </div>
  );
}
