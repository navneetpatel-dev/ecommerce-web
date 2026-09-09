import { Skeleton } from "@/shared/components/ui/skeleton";
import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { loadingPagesStyles as styles } from "@/app/_styles/loading-pages.styles";

/** Content-only — admin layout already keeps header + sidebar. */
export default function AdminLoading() {
  return (
    <div className={styles.adminContainer}>
      <div className={styles.titleStack}>
        <Skeleton className={styles.skelH8W48} />
        <Skeleton className={styles.skelH4W72} />
      </div>
      <Skeleton className={styles.skelH40Rounded} />
      <SkeletonRows count={6} height="h-12 w-full" />
    </div>
  );
}
