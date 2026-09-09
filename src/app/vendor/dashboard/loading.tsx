import { Skeleton } from "@/shared/components/ui/skeleton";
import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { loadingPagesStyles as styles } from "@/app/_styles/loading-pages.styles";

const METRIC_SKELETON_COUNT = 4;
const metricSkeletons = Array.from({ length: METRIC_SKELETON_COUNT }).map(
  (_, i) => <Skeleton key={i} className={styles.skelH24Rounded} />,
);

/** Content-only — vendor layout already keeps header + sidebar. */
export default function VendorDashboardLoading() {
  return (
    <div className={styles.adminContainer}>
      <div className={styles.titleStack}>
        <Skeleton className={styles.skelH8W52} />
        <Skeleton className={styles.skelH4W64} />
      </div>
      <div className={styles.vendorMetricGrid}>{metricSkeletons}</div>
      <SkeletonRows count={5} height="h-12 w-full" />
    </div>
  );
}
