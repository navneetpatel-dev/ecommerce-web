"use client";

import { useOrderHistoryPage } from "../../hooks/list/useOrderHistoryPage.hook";
import { OrdersList } from "../../components/list/OrdersList.component";
import { EmptyOrdersState } from "../../components/list/EmptyOrdersState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { ordersPagesStyles } from "./ordersPages.styles";

export function OrderHistoryPage() {
  const history = useOrderHistoryPage();

  if (history.isLoading) {
    return (
      <div className={ordersPagesStyles.historyLoadingContainer}>
        <Skeleton className={ordersPagesStyles.historySkeletonSmall} />
        <Skeleton className={ordersPagesStyles.historySkeletonHeader} />
        <Skeleton className={ordersPagesStyles.historySkeletonRow} />
        <Skeleton className={ordersPagesStyles.historySkeletonRow} />
        <Skeleton className={ordersPagesStyles.historySkeletonRow} />
      </div>
    );
  }

  if (history.isError) {
    return (
      <div className={ordersPagesStyles.historyErrorContainer}>
        <div className={ordersPagesStyles.historyErrorBox}>
          <p className={ordersPagesStyles.historyErrorText}>
            {LABELS.errorRetryHint}
          </p>
          <button
            type="button"
            onClick={history.onRetry}
            className={ordersPagesStyles.historyRetryButton}
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
