import { Skeleton } from "@/shared/components/ui/skeleton";
import { SkeletonRows } from "@/shared/components/Skeletons.component";

/** Content-only — admin layout already keeps header + sidebar. */
export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-40 w-full rounded-md" />
      <SkeletonRows count={6} height="h-12 w-full" />
    </div>
  );
}
