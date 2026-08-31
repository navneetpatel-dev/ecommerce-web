import { Skeleton } from "@/shared/components/ui/skeleton";

export function OrderDetailSkeleton() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-6 md:py-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-56 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
          <div className="flex flex-wrap gap-2 pt-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <Skeleton className="h-44 w-full rounded-md" />
            <Skeleton className="h-44 w-full rounded-md" />
            <Skeleton className="h-44 w-full rounded-md" />
          </div>
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="space-y-4 border border-line bg-surface-raised p-5 shadow-elevation-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="mt-4 h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
