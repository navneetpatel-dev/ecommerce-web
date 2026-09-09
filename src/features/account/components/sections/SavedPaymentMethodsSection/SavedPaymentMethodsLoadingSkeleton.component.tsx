import { Skeleton } from "@/shared/components/ui/skeleton";
import { savedPaymentMethodsSectionStyles as styles } from "./savedPaymentMethodsSection.styles";

export function SavedPaymentMethodsLoadingSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <Skeleton className={styles.skeletonItem} />
      <Skeleton className={styles.skeletonItem} />
    </div>
  );
}
