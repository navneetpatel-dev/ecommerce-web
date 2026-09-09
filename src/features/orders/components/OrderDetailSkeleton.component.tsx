import { Skeleton } from "@/shared/components/ui/skeleton";
import { orderDetailSkeletonStyles as styles } from "./orderDetailSkeleton.styles";

export function OrderDetailSkeleton() {
  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.radialBg} />

      <div className={styles.container}>
        <div className={styles.headerSpace}>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-56 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
          <div className={styles.badgeRow}>
            <Skeleton className={`${styles.badgePill} w-24`} />
            <Skeleton className={`${styles.badgePill} w-28`} />
          </div>
        </div>

        <div className={styles.layoutGrid}>
          <div className={styles.mainCol}>
            <Skeleton className={styles.mainCard} />
            <Skeleton className={styles.mainCard} />
            <Skeleton className={styles.mainCard} />
          </div>
          <aside className={styles.aside}>
            <div className={styles.asideCard}>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className={`mt-4 ${styles.asideButton}`} />
              <Skeleton className={styles.asideButton} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
