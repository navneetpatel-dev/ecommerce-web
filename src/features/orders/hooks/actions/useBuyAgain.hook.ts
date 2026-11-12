"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cartApi, cartKeys, useCartDrawerStore } from "@/features/cart";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import type { OrderItem } from "@/shared/api/types";

/** Wide screens open the cart drawer straight away; phones get the toast's View cart. */
const DESKTOP_QUERY = "(min-width: 1024px)";

const openCartDrawer = () => useCartDrawerStore.getState().open();

export interface BuyAgainResult {
  addedCount: number;
  totalCount: number;
  unavailableNames: string[];
}

/** Re-adds every item from a past order/suborder to the cart, skipping whatever's no longer purchasable. */
export function useBuyAgain() {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<BuyAgainResult | null>(null);

  const buyAgain = async (items: OrderItem[]) => {
    setIsPending(true);
    setResult(null);
    let addedCount = 0;
    const unavailableNames: string[] = [];

    for (const item of items) {
      try {
        await cartApi.addItem(item.variantId, item.quantity);
        addedCount += 1;
      } catch {
        unavailableNames.push(item.productName);
      }
    }

    setResult({ addedCount, totalCount: items.length, unavailableNames });
    setIsPending(false);
    if (addedCount === 0) return;
    // C-14: the cart count was stale and there was no next step.
    void queryClient.invalidateQueries({ queryKey: cartKeys.all });
    notifySuccess(
      formatLabel(LABELS.buyAgainAddedToast, { count: addedCount }),
      { label: LABELS.buyAgainViewCart, onClick: openCartDrawer },
    );
    if (window.matchMedia?.(DESKTOP_QUERY).matches) openCartDrawer();
  };

  return {
    buyAgain,
    isPending,
    result,
    clearResult: () => setResult(null),
  };
}
