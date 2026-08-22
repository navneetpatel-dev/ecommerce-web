"use client";

import { useOrderHistoryPage } from "../hooks/useOrderHistoryPage";
import { OrdersList } from "../components/OrdersList";
import { EmptyOrdersState } from "../components/EmptyOrdersState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";

export function OrderHistoryPage() {
  const history = useOrderHistoryPage();

  if (history.isLoading) {
    return (
      <div className="storefront-container space-y-3 py-8">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="mb-6 h-12 w-48" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (history.isError) {
    return (
      <div className="storefront-container py-8">
        <div className="border border-line bg-surface-raised px-5 py-10 text-center">
          <p className="text-[0.9375rem] text-ink-muted">
            {LABELS.errorRetryHint}
          </p>
          <button
            type="button"
            onClick={history.onRetry}
            className="mt-2 text-[0.875rem] font-medium text-brand underline-offset-4 hover:underline"
          >
            {LABELS.retry}
          </button>
        </div>
      </div>
    );
  }

  if (history.isEmpty) return <EmptyOrdersState />;

  return <OrdersList orders={history.orders} pagination={history.pagination} />;
}
