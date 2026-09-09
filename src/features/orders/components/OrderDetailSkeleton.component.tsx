import { Skeleton } from "@/shared/components/ui/skeleton";
import { orderDetailSkeletonStyles as styles } from "./orderDetailSkeleton.styles";

export function OrderDetailSkeleton() {
  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.radialBg} />

      <div className={styles.container}>
        <div className={styles.headerSpace}>
          <Skeleton className={styles.headerCrumb} />
          <Skeleton className={styles.headerTitle} />
          <Skeleton className={styles.headerMeta} />
          <div className={styles.badgeRow}>
            <Skeleton className={styles.badgePill1} />
            <Skeleton className={styles.badgePill2} />
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
              <Skeleton className={styles.asideHeading} />
              <Skeleton className={styles.asideTotal} />
              <Skeleton className={styles.asideLine1} />
              <Skeleton className={styles.asideLine2} />
              <Skeleton className={styles.asideButtonTop} />
              <Skeleton className={styles.asideButton} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
