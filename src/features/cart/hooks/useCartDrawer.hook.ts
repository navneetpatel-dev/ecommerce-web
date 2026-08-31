"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "../api/cart.queries";
import { useCartDrawerStore } from "../store/cart.store";
import { cartHasPendingLineSubtotals } from "../utils/cartDisplay.utils";
import { groupItemsByVendor } from "../utils/cart.utils";
import { navigate } from "@/shared/utils/navigate";
import { clampCartQuantity } from "@/shared/constants/cart";
import { PATHS } from "@/shared/constants/paths";
import type { CartItem } from "@/shared/api/types";

export function useCartDrawer() {
  const router = useRouter();
  const isOpen = useCartDrawerStore((s) => s.isOpen);
  const close = useCartDrawerStore((s) => s.close);
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const groupedByVendor = useMemo(() => {
    if (!cart?.items) return {} as Record<string, CartItem[]>;
    return groupItemsByVendor(cart.items);
  }, [cart]);

  const pendingLineTotals = cartHasPendingLineSubtotals(cart);
  const grandTotal =
    !pendingLineTotals && cart
      ? (cart.total ?? cart.pricingPreview?.grandTotal)
      : undefined;
  const total = grandTotal ?? cart?.merchandiseSubtotal ?? 0;
  const totalIsEstimated = grandTotal == null;

  const hasUnavailableItems =
    cart?.items?.some((item) => item.isAvailable === false) ?? false;

  const updateQuantity = (itemId: string, quantity: number) => {
    updateItem.mutate({ itemId, quantity: clampCartQuantity(quantity) });
  };

  const continueShopping = () => {
    close();
    navigate(router, PATHS.products);
  };

  const removeItemById = (itemId: string) => removeItem.mutate(itemId);
  const items = cart?.items ?? [];
  const hasItems = Boolean(cart?.items?.length);

  return {
    isOpen,
    close,
    isLoading,
    items,
    hasItems,
    hasUnavailableItems,
    groupedByVendor,
    total,
    totalIsEstimated,
    pendingLineTotals,
    updateQuantity,
    removeItem: removeItemById,
    continueShopping,
  };
}
