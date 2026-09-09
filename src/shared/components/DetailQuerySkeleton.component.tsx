import { Skeleton } from "@/shared/components/ui/skeleton";
import { detailQuerySkeletonStyles } from "./displayComponents.styles";

interface DetailQuerySkeletonProps {
  className?: string;
}

/** Lightweight skeleton for admin / support detail routes while queries resolve. */
export function DetailQuerySkeleton({ className }: DetailQuerySkeletonProps) {
  const containerClassName = className ?? detailQuerySkeletonStyles.container;

  return (
    <div className={containerClassName}>
      <Skeleton className={detailQuerySkeletonStyles.hero} />
      <Skeleton className={detailQuerySkeletonStyles.body} />
    </div>
  );
}
