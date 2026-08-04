import { Skeleton } from '@/shared/components/ui/skeleton'

export default function VendorDashboardLoading() {
  return (
    <div className="min-h-screen bg-paper">
      <Skeleton className="h-14 w-full rounded-none" />
      <div className="flex">
        <Skeleton className="h-[calc(100vh-3.5rem)] w-56 shrink-0 rounded-none" />
        <main className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </main>
      </div>
    </div>
  )
}
