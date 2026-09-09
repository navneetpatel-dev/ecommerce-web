import { Skeleton } from "@/shared/components/ui/skeleton";

interface DetailQuerySkeletonProps {
  className?: string;
}

/** Lightweight skeleton for admin / support detail routes while queries resolve. */
export function DetailQuerySkeleton({ className }: DetailQuerySkeletonProps) {
  const containerClassName =
    className ?? "storefront-container space-y-3 py-6 md:py-8";

  return (
    <div className={containerClassName}>
      <Skeleton className="h-14 w-full max-w-xl" />
      <Skeleton className="h-64 w-full rounded-md" />
    </div>
  );
}
