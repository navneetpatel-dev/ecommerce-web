import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/dom/cn";
import { skeletonPrimitivesStyles } from "../../styles/skeletons/primitives.styles";

interface SkeletonRowsProps {
  count: number;
  height?: string;
}

export function SkeletonRows({
  count,
  height = skeletonPrimitivesStyles.defaultRowHeight,
}: SkeletonRowsProps) {
  return (
    <div className={skeletonPrimitivesStyles.rowsContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={height} />
      ))}
    </div>
  );
}

export function SkeletonGrid({
  count,
  aspect = skeletonPrimitivesStyles.defaultAspect,
}: {
  count: number;
  aspect?: string;
}) {
  return (
    <div className={skeletonPrimitivesStyles.gridContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={skeletonPrimitivesStyles.gridItem}>
          <Skeleton
            className={cn(aspect, skeletonPrimitivesStyles.imageRounded)}
          />
          <Skeleton className={skeletonPrimitivesStyles.h3w24} />
          <Skeleton className={skeletonPrimitivesStyles.h4wFull} />
          <Skeleton className={skeletonPrimitivesStyles.h3w16} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({
  count,
  height = skeletonPrimitivesStyles.defaultCardHeight,
}: SkeletonRowsProps) {
  return (
    <div className={skeletonPrimitivesStyles.cardContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(height, skeletonPrimitivesStyles.roundedMd)}
        />
      ))}
    </div>
  );
}

export function CategoryGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className={skeletonPrimitivesStyles.categoryGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={skeletonPrimitivesStyles.categoryItem} />
      ))}
    </div>
  );
}

/** Placeholder for analytics chart cards so lazy-loaded recharts chunks don't shift layout. */
export function SkeletonChartCard({
  bodyHeight = skeletonPrimitivesStyles.defaultChartHeight,
}: {
  bodyHeight?: string;
}) {
  return (
    <div className={skeletonPrimitivesStyles.chartCard}>
      <Skeleton className={skeletonPrimitivesStyles.h4w40} />
      <Skeleton
        className={cn(bodyHeight, skeletonPrimitivesStyles.chartSkeleton)}
      />
    </div>
  );
}

export function ReviewListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className={skeletonPrimitivesStyles.reviewList}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={skeletonPrimitivesStyles.reviewCard}>
          <div className={skeletonPrimitivesStyles.reviewHeader}>
            <Skeleton className={skeletonPrimitivesStyles.h4w24} />
            <Skeleton className={skeletonPrimitivesStyles.h3w16} />
          </div>
          <Skeleton className={skeletonPrimitivesStyles.h4w40} />
          <Skeleton className={skeletonPrimitivesStyles.h3wFull} />
          <Skeleton className={skeletonPrimitivesStyles.h3w5_6} />
        </div>
      ))}
    </div>
  );
}
