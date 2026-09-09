"use client";

import { useState } from "react";
import { cartApi } from "@/features/cart";
import type { OrderItem } from "@/shared/api/types";

export interface BuyAgainResult {
  addedCount: number;
  totalCount: number;
  unavailableNames: string[];
}

/** Re-adds every item from a past order/suborder to the cart, skipping whatever's no longer purchasable. */
export function useBuyAgain() {
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
  };

  return {
    buyAgain,
    isPending,
    result,
    clearResult: () => setResult(null),
  };
}
