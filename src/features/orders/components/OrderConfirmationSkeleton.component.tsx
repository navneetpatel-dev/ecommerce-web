import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";

/**
 * Mirrors OrderConfirmation's centred layout so the route transition from
 * checkout lands on the same shape the confirmed order will occupy.
 */
export function OrderConfirmationSkeleton() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_14%,transparent),transparent_50%)]"
      />

      <div
        className="storefront-container relative py-16 md:py-20"
        aria-busy="true"
        aria-label={LABELS.orderDetailsLoading}
      >
        <div className="mx-auto flex max-w-lg flex-col items-center">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="mt-6 h-3 w-20" />
          <Skeleton className="mt-3 h-9 w-64 max-w-full" />
          <Skeleton className="mt-3 h-3 w-24" />
          <Skeleton className="mt-4 h-4 w-full max-w-sm" />
          <Skeleton className="mt-2 h-4 w-4/5 max-w-sm" />

          <div className="mt-6 w-full max-w-sm rounded-md border border-line bg-surface-raised px-4 py-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-4/5" />
            <Skeleton className="mt-2 h-3 w-3/5" />
          </div>

          <div className="mt-8 flex w-full max-w-sm flex-col-reverse justify-center gap-3 sm:flex-row">
            <Skeleton className="h-11 w-full sm:w-40" />
            <Skeleton className="h-11 w-full sm:w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
