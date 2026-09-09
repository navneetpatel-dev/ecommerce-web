import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";

interface InlineAmountSkeletonProps {
  className?: string;
}

/** Inline shimmer placeholder for backend-computed monetary values. */
export function InlineAmountSkeleton({ className }: InlineAmountSkeletonProps) {
  return (
    <span
      role="status"
      aria-label={LABELS.updatingEllipsis}
      data-amount-state="updating"
      className={cn(
        "inline-block h-4 w-20 rounded-sm bg-gradient-to-r from-line via-line/40 to-line bg-[length:200%_100%] align-middle animate-shimmer",
        className,
      )}
    />
  );
}
