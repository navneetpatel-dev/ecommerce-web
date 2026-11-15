"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { vendorStorefrontPageStyles as styles } from "./vendorStorefrontPage.styles";

const SKELETON_SLOTS = [
  "storefront-sk-1",
  "storefront-sk-2",
  "storefront-sk-3",
  "storefront-sk-4",
  "storefront-sk-5",
  "storefront-sk-6",
  "storefront-sk-7",
  "storefront-sk-8",
] as const;

export function VendorStorefrontLoadingSkeleton() {
  return (
    <div className={styles.loadingContainer}>
      <Skeleton className={styles.loadingBanner} />
      <Skeleton className={styles.loadingTitle} />
      <Skeleton className={styles.loadingSubtitle} />
      <div className={styles.loadingGrid}>
        {SKELETON_SLOTS.map((key) => (
          <Skeleton key={key} className={styles.loadingProductCard} />
        ))}
      </div>
    </div>
  );
}
