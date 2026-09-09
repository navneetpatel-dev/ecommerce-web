import { Skeleton } from "@/shared/components/ui/skeleton";
import { SkeletonRows } from "@/shared/components/Skeletons.component";

const METRIC_SKELETON_COUNT = 4;
const metricSkeletons = Array.from({ length: METRIC_SKELETON_COUNT }).map(
  (_, i) => <Skeleton key={i} className="h-24 w-full rounded-md" />,
);

/** Content-only — vendor layout already keeps header + sidebar. */
export default function VendorDashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricSkeletons}
      </div>
      <SkeletonRows count={5} height="h-12 w-full" />
    </div>
  );
}
