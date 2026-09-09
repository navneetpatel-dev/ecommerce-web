import { Skeleton } from "@/shared/components/ui/skeleton";
import { ordersActivitySectionStyles as styles } from "./ordersActivitySection.styles";

export function RecentOrdersLoadingSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <Skeleton className={styles.skeletonItem} />
      <Skeleton className={styles.skeletonItem} />
    </div>
  );
}
