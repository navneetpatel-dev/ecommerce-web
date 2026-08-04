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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className={`${aspect} rounded-lg`} />
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
        <Skeleton key={i} className={height} />
      ))}
    </div>
  )
}
