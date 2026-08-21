"use client";

import { useCallback } from "react";
import { useAddToCart } from "@/features/cart";
import { clampCartQuantity } from "@/shared/constants/cart";

interface UseProductDetailActionsOptions {
  resolvedVariantId: string | null;
  needsOptionSelection: boolean;
  variantUnavailable: boolean;
  maxQuantity: number;
}

export function useProductDetailActions({
  resolvedVariantId,
  needsOptionSelection,
  variantUnavailable,
  maxQuantity,
}: UseProductDetailActionsOptions) {
  const addToCart = useAddToCart();

  const handleAddToCart = useCallback(
    (qty: number) => {
      if (!resolvedVariantId || needsOptionSelection || variantUnavailable)
        return;
      addToCart.mutate({
        variantId: resolvedVariantId,
        quantity: Math.min(maxQuantity, clampCartQuantity(qty)),
        openDrawer: false,
      });
    },
    [
      addToCart,
      maxQuantity,
      needsOptionSelection,
      resolvedVariantId,
      variantUnavailable,
    ],
  );

  return { isAddingToCart: addToCart.isPending, handleAddToCart };
}
