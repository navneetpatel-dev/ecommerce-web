"use client";

import { useAddToCart } from "@/features/cart";
import { useVariantSelection } from "./useVariantSelection";
import type { ProductVariant } from "@/shared/api/types";

export function useVariantSelector(
  variants: ProductVariant[],
  basePrice: number,
  baseStock: number,
) {
  const addToCart = useAddToCart();
  const selection = useVariantSelection(variants, basePrice, baseStock);

  const canAdd = Boolean(selection.variantId) || variants.length <= 1;

  return {
    ...selection,
    canAddToCart: canAdd && selection.currentStock > 0,
    isAddingToCart: addToCart.isPending,
    addSelectedToCart: () => {
      const variantId = selection.variantId ?? variants[0]?.id;
      if (!variantId) return;
      addToCart.mutate({ variantId, quantity: 1 });
    },
  };
}
