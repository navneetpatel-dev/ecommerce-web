import { Skeleton } from "@/shared/components/ui/skeleton";
import { deliveryOperationsSectionStyles as styles } from "../../../styles/delivery-operations/deliveryOperationsSection.styles";

export function DeliveryOperationsSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.skeletonCard}>
        <Skeleton className={styles.skeletonTitle} />
        <Skeleton className={styles.skeletonSubtitle} />
        <Skeleton className={styles.skeletonAction} />
      </div>
    </div>
  );
}
