"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useWriteReviewDialog } from "@/features/reviews";
import type { OrderItem } from "@/shared/api/types";
import { ordersKeys } from "../../api/orders/orders.queries";

/** One write-review dialog for a sub-order's lines; the order refetches after a post. */
export function useOrderLineReviews() {
  const queryClient = useQueryClient();
  const dialog = useWriteReviewDialog(() => {
    void queryClient.invalidateQueries({ queryKey: ordersKeys.all });
  });

  const openFor = (item: OrderItem) => {
    if (!item.productId) return;
    dialog.open({
      orderItemId: item.id,
      productId: item.productId,
      productName: item.productName,
    });
  };

  return { ...dialog, openFor };
}
