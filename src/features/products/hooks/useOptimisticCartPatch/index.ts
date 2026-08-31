"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/features/cart";
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
    return {
      ...base,
      items: base.items.filter((item) =>
        itemId ? item.id !== itemId : item.variantId !== variantId,
      ),
    };
  }

  const existing = base.items.find((item) =>
    itemId ? item.id === itemId : item.variantId === variantId,
  );

  if (existing) {
    return {
      ...base,
      items: base.items.map((item) =>
        item.id === existing.id ? { ...item, quantity } : item,
      ),
    };
  }

  return {
    ...base,
    items: [
      ...base.items,
      {
        id: `optimistic-${variantId}`,
        variantId,
        quantity,
        lineSubtotal: product.basePrice * quantity,
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
