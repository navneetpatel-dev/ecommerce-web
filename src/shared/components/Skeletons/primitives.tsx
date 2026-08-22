import { Skeleton } from "@/shared/components/ui/skeleton";

interface SkeletonRowsProps {
  count: number;
  height?: string;
}

export function SkeletonRows({
  count,
  height = "h-10 w-full",
}: SkeletonRowsProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={height} />
      ))}
    </div>
  );
}

export function SkeletonGrid({
  count,
  aspect = "aspect-square",
}: {
  count: number;
  aspect?: string;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className={`${aspect} rounded-md w-full`} />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({
  count,
  height = "h-32 w-full",
}: SkeletonRowsProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`${height} rounded-md`} />
      ))}
    </div>
  );
}

export function CategoryGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] w-full rounded-md" />
      ))}
    </div>
  );
}

/** Placeholder for analytics chart cards so lazy-loaded recharts chunks don't shift layout. */
export function SkeletonChartCard({
  bodyHeight = "h-64",
}: {
  bodyHeight?: string;
}) {
  return (
    <div className="space-y-3 rounded-md border border-line bg-surface p-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className={`${bodyHeight} w-full rounded-md`} />
    </div>
  );
}

export function ReviewListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-md border border-line bg-surface p-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}
