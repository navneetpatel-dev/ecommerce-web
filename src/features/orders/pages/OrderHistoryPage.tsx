"use client";

import { useOrderHistoryPage } from "../hooks/useOrderHistoryPage";
import { OrdersList } from "../components/OrdersList";
import { EmptyOrdersState } from "../components/EmptyOrdersState";
import { Skeleton } from "@/shared/components/ui/skeleton";

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

  if (history.isEmpty) return <EmptyOrdersState />;

  return <OrdersList orders={history.orders} pagination={history.pagination} />;
}
