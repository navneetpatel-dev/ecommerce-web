import { Skeleton } from "@/shared/components/ui/skeleton";

export function AdminOrderDetailDrawerSkeleton() {
  return (
    <div className="space-y-5 py-2" data-testid="order-drawer-skeleton">
      <div className="rounded-lg border border-line bg-paper/40 p-4 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-3 w-64" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="rounded-lg border border-line bg-surface p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-line/50 pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-3 py-1">
            <Skeleton className="h-10 w-10 rounded shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-16 shrink-0" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper/40 p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
