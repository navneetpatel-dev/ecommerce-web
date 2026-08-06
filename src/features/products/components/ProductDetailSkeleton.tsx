import { Skeleton } from '@/shared/components/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="storefront-container py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <Skeleton className="md:col-span-7 aspect-4/3 rounded-lg" />
        <div className="md:col-span-5 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-11 w-20" />
        </div>
      </div>
    </div>
  )
}
