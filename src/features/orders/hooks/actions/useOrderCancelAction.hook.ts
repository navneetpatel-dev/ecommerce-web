"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { useCancelOrder } from "../../api/orders/orders.queries";
import { canCancelOrder } from "../../utils/actions/orderCancel.utils";
import type { Order } from "@/shared/api/types";

/** "Order cancelled", and where its items (and coupon) went, so the cart never surprises. */
function orderCancelledMessage(restored?: {
  items: number;
  coupons: string[];
}): string {
  if (!restored || restored.items === 0) return LABELS.orderCancelledSuccess;
  return restored.coupons.length > 0
    ? LABELS.orderCancelledItemsAndCouponInCart
    : LABELS.orderCancelledItemsInCart;
}

export function useOrderCancelAction(order: Order) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelMutation = useCancelOrder(order.id);
  const canCancel = canCancelOrder(order);

  const confirmCancel = async () => {
    setError(null);
    setMessage(null);
    try {
      const result = await cancelMutation.mutateAsync();
      setMessage(orderCancelledMessage(result?.restoredToCart));
      setOpen(false);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.orderCancelFailed));
    }
  };

  return {
    canCancel,
    open,
    setOpen,
    message,
    error,
    isPending: cancelMutation.isPending,
    confirmCancel,
  };
}
