"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/features/cart";
import {
  patchExistingCartItemQuantity,
  patchRemoveCartItem,
} from "@/features/cart/utils/cartDisplay.utils";
import type { Cart, ProductListItem } from "@/shared/api/types";

export function patchCartQuantity(
  cart: Cart | undefined,
  args: {
    product: ProductListItem;
    variantId: string;
    itemId?: string;
    quantity: number;
  },
): Cart {
  const base: Cart = cart ?? { id: "optimistic-cart", items: [] };
  const { product, variantId, itemId, quantity } = args;

  if (quantity <= 0) {
    if (itemId) return patchRemoveCartItem(base, itemId);
    const existing = base.items.find((item) => item.variantId === variantId);
    if (existing) return patchRemoveCartItem(base, existing.id);
    return {
      ...base,
      items: base.items.filter((item) => item.variantId !== variantId),
      merchandiseSubtotal: undefined,
      total: undefined,
      pricingPreview: undefined,
    };
  }

  const existing = base.items.find((item) =>
    itemId ? item.id === itemId : item.variantId === variantId,
  );

  if (existing) {
    return patchExistingCartItemQuantity(base, existing.id, quantity);
  }

  return {
    ...base,
    items: [
      ...base.items,
      {
        id: `optimistic-${variantId}`,
        variantId,
        quantity,
        isAvailable: true,
        unavailableReason: null,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: product.imageUrl,
          price: product.basePrice,
          vendor: product.vendor,
        },
        variant: { sku: "", attributes: {} },
      },
    ],
    merchandiseSubtotal: undefined,
    total: undefined,
    pricingPreview: undefined,
  };
}

export function useOptimisticCartPatch(product: ProductListItem) {
  const queryClient = useQueryClient();

  return useCallback(
    (variantId: string, quantity: number, itemId?: string) => {
      const entries = queryClient.getQueriesData<Cart>({
        queryKey: cartKeys.all,
      });
      const previous = entries[0]?.[1];
      queryClient.setQueriesData<Cart>({ queryKey: cartKeys.all }, (current) =>
        patchCartQuantity(current ?? previous, {
          product,
          variantId,
          itemId,
          quantity,
        }),
      );
      return previous;
    },
    [product, queryClient],
  );
}
