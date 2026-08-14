import { Skeleton } from '@/shared/components/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="storefront-container pb-10 pt-4 sm:pt-6 md:pb-14 md:pt-8">
      <Skeleton className="mb-6 h-4 w-48" />
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 lg:gap-10">
        <div className="md:col-span-6 lg:col-span-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">
            <div className="order-2 flex gap-2 lg:order-1 lg:w-[4.5rem] lg:flex-col">
              <Skeleton className="h-16 w-16 shrink-0 rounded-md lg:h-[4.5rem] lg:w-[4.5rem]" />
              <Skeleton className="h-16 w-16 shrink-0 rounded-md lg:h-[4.5rem] lg:w-[4.5rem]" />
              <Skeleton className="hidden h-16 w-16 shrink-0 rounded-md lg:block lg:h-[4.5rem] lg:w-[4.5rem]" />
            </div>
            <Skeleton className="order-1 aspect-square w-full rounded-xl lg:order-2 lg:aspect-auto lg:h-[min(56rem,calc(100dvh-7.5rem))]" />
          </div>
        </div>
        <div className="space-y-5 md:col-span-6 lg:col-span-5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
