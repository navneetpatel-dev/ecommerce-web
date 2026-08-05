import { Skeleton } from '@/shared/components/ui/skeleton'

interface SkeletonRowsProps {
  count: number
  height?: string
}

export function SkeletonRows({ count, height = 'h-10 w-full' }: SkeletonRowsProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={height} />
      ))}
    </div>
  )
}

export function SkeletonGrid({ count, aspect = 'aspect-square' }: { count: number; aspect?: string }) {
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
  )
}

export function SkeletonCard({ count, height = 'h-32 w-full' }: SkeletonRowsProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`${height} rounded-md`} />
      ))}
    </div>
  )
}

/** Home / generic storefront content while a soft navigation settles. */
export function StorefrontPageSkeleton() {
  return (
    <div className="space-y-12 md:space-y-20 pb-12">
      <Skeleton className="h-[min(78vh,640px)] w-full rounded-none md:h-[min(82vh,720px)]" />
      <div className="mx-auto max-w-[1600px] space-y-10 px-4">
        <div className="space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-48" />
        </div>
        <CategoryGridSkeleton count={10} />
        <div className="space-y-3 pt-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-40" />
        </div>
        <SkeletonGrid count={8} />
      </div>
    </div>
  )
}

export function CategoryGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] w-full rounded-md" />
      ))}
    </div>
  )
}

export function CartPageSkeleton() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 md:py-8">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-4 lg:col-span-7 xl:col-span-8">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CheckoutPageSkeleton() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 md:py-8">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-64" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-4 lg:col-span-7 xl:col-span-8">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-80" />
            <Skeleton className="mt-4 h-40 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CategoriesPageSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-10 px-4 py-10 md:py-14">
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <CategoryGridSkeleton count={10} />
    </div>
  )
}

export function ProfilePageSkeleton() {
  return (
    <div className="mx-auto max-w-[800px] space-y-6 px-4 py-10">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-32 w-full rounded-md" />
      <Skeleton className="h-48 w-full rounded-md" />
    </div>
  )
}

export function WalletPageSkeleton() {
  return (
    <div className="mx-auto max-w-[1000px] space-y-6 px-4 py-10">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-36 w-full rounded-md" />
      <SkeletonRows count={4} height="h-12 w-full" />
    </div>
  )
}

export function WishlistPageSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-10">
      <Skeleton className="h-8 w-36" />
      <SkeletonGrid count={8} />
    </div>
  )
}

export function ContentPageSkeleton() {
  return (
    <div className="mx-auto max-w-[800px] space-y-4 px-4 py-12">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="mt-6 h-48 w-full rounded-md" />
    </div>
  )
}

export function ReviewListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-md border border-line bg-surface p-4">
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
  )
}
