import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";

/**
 * Mirrors OrderConfirmation's hero band plus items/totals split, so arriving
 * from checkout lands on the shape the confirmed order will occupy.
 */
export function OrderConfirmationSkeleton() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_14%,transparent),transparent_60%)]"
      />

      <div
        className="storefront-container relative py-10 sm:py-12 lg:py-16"
        aria-busy="true"
        aria-label={LABELS.orderDetailsLoading}
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <Skeleton className="size-16 shrink-0 rounded-full" />
              <div className="w-full space-y-2.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-9 w-64 max-w-full" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full max-w-lg" />
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Skeleton className="h-11 w-full sm:w-32" />
              <Skeleton className="h-11 w-full sm:w-40" />
            </div>
          </div>

          <div className="mt-8 grid items-start gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)] lg:gap-10">
            <div className="min-w-0">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mb-4 mt-2 h-7 w-52" />
              <div className="space-y-4">
                {[0, 1].map((group) => (
                  <div
                    key={group}
                    className="border border-line bg-surface-raised px-4 py-3.5 shadow-elevation-1 sm:px-5"
                  >
                    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                    <div className="flex items-start gap-3 py-3 sm:gap-4">
                      <Skeleton className="size-14 rounded-sm sm:size-16" />
                      <div className="flex-1 space-y-2 pt-0.5">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border border-line bg-surface-raised p-5 shadow-elevation-1 sm:p-6">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="mt-4 h-7 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
