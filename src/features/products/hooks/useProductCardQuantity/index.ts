"use client";

import { useEffect, useState } from "react";
import {
  cartKeys,
  useAddToCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/features/cart";
import type { CartItem, ProductListItem } from "@/shared/api/types";
import {
  cartLineQuantityMax,
  clampCartQuantity,
} from "@/shared/constants/cart";
import { resolveProductStock } from "../../utils/productListItem";
import { useOptimisticCartPatch } from "../useOptimisticCartPatch/index";

interface UseProductCardQuantityOptions {
  product: ProductListItem;
  defaultVariantId?: string;
  cartItem: CartItem | null;
  serverQty: number;
}

export function useProductCardQuantity({
  product,
  defaultVariantId,
  cartItem,
  serverQty,
}: UseProductCardQuantityOptions) {
  const queryClient = useQueryClient();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: updateCartItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeCartItem, isPending: isRemoving } = useRemoveCartItem();
  const applyOptimisticCart = useOptimisticCartPatch(product);

  const [optimisticQty, setOptimisticQty] = useState<number | null>(null);

  useEffect(() => {
    if (optimisticQty === null) return;
    if (serverQty === optimisticQty) {
      setOptimisticQty(null);
    }
  }, [serverQty, optimisticQty]);

  const cartQuantity = optimisticQty ?? serverQty;
  const maxQuantity = cartLineQuantityMax(resolveProductStock(product));
  const isMutating = isAdding || isUpdating || isRemoving;

  const setQuantity = (next: number) => {
    if (!defaultVariantId) return;

    const clamped =
      next <= 0 ? 0 : Math.min(maxQuantity, clampCartQuantity(next));
    setOptimisticQty(clamped);
    const previous = applyOptimisticCart(
      defaultVariantId,
      clamped,
      cartItem?.id,
    );

    const rollback = () => {
      setOptimisticQty(null);
      if (previous)
        queryClient.setQueriesData({ queryKey: cartKeys.all }, previous);
    };

    if (clamped <= 0) {
      if (cartItem && !cartItem.id.startsWith("optimistic-")) {
        removeCartItem(cartItem.id, { onError: rollback });
      } else if (!cartItem) {
        setOptimisticQty(null);
      }
      return;
    }

    if (!cartItem) {
      addToCart(
        { variantId: defaultVariantId, quantity: clamped, openDrawer: false },
        { onError: rollback },
      );
      return;
    }

    if (cartItem.id.startsWith("optimistic-")) {
      return;
    }

    updateCartItem(
      { itemId: cartItem.id, quantity: clamped },
      { onError: rollback },
    );
  };

  return { cartQuantity, maxQuantity, setQuantity, isMutating };
}
