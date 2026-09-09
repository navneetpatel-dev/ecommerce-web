import { Skeleton } from "@/shared/components/ui/skeleton";
import { addressesSectionStyles as styles } from "./addressesSection.styles";

export function AddressesLoadingSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <Skeleton className={styles.skeletonItem} />
      <Skeleton className={styles.skeletonItem} />
    </div>
  );
}
