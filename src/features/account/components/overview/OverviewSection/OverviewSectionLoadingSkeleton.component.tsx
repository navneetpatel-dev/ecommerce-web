import { Skeleton } from "@/shared/components/ui/skeleton";
import { overviewSectionStyles as styles } from "./overviewSection.styles";

export function OverviewSectionLoadingSkeleton() {
  return (
    <div className={styles.loadingSkeletonCard}>
      <div className={styles.loadingSkeletonRow}>
        <Skeleton className={styles.loadingSkeletonAvatar} />
        <div className={styles.loadingSkeletonInfo}>
          <Skeleton className={styles.loadingSkeletonName} />
          <Skeleton className={styles.loadingSkeletonEmail} />
        </div>
      </div>
    </div>
  );
}
