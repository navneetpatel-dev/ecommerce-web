"use client";

import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { hasOrderPaymentSummaryContent } from "../../utils/detail/orderPaymentSummary.utils";
import { useOrder } from "../../api/orders/orders.queries";
import type { Order } from "@/shared/api/types";

export function useOrderConfirmation(orderId: string | undefined) {
  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = resolveQueryDetailState(useOrder(orderId ?? ""), {
    enabled: Boolean(orderId),
  });

  const typedOrder = (order as Order | undefined) ?? null;
  const showPaymentSummary =
    typedOrder != null && hasOrderPaymentSummaryContent(typedOrder);
  const showItemsSkeleton = Boolean(orderId) && isOrderLoading;
  const showLoadError = Boolean(orderId) && isOrderError && !isOrderLoading;

  return {
    order: typedOrder,
    isOrderLoading,
    showPaymentSummary,
    showItemsSkeleton,
    showLoadError,
  };
}
