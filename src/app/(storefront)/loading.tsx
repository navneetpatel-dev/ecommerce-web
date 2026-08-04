import { Skeleton } from '@/shared/components/ui/skeleton'

export default function StorefrontLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  )
}
