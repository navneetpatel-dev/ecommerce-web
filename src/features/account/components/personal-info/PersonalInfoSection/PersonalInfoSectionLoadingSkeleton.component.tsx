import { Skeleton } from "@/shared/components/ui/skeleton";
import { personalInfoSectionStyles as styles } from "../../../styles/personal-info/personalInfoSection.styles";

export function PersonalInfoSectionLoadingSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton className={styles.skeletonTitle} />
      <Skeleton className={styles.skeletonInput} />
      <Skeleton className={styles.skeletonInput} />
      <Skeleton className={styles.skeletonInput} />
    </div>
  );
}
