import { Skeleton } from "@/shared/components/ui/skeleton";
import { securitySectionStyles as styles } from "./securitySection.styles";

export function SessionsLoadingSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <Skeleton className={styles.skeletonItem} />
      <Skeleton className={styles.skeletonItem} />
    </div>
  );
}
