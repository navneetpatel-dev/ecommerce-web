import { SkeletonGrid } from '@/shared/components/Skeletons'
import { Skeleton } from '@/shared/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pt-8 pb-8">
      <div className="flex gap-8">
        <div className="hidden w-64 shrink-0 space-y-4 lg:block">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-9 w-40" />
          </div>
          <SkeletonGrid count={8} />
        </div>
      </div>
    </div>
  )
}
