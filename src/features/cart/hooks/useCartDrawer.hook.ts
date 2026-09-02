"use client";

import { useMemo } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  cartMutationKeys,
} from "../api/cart.queries";
import { useCartDrawerStore } from "../store/cart.store";
import { resolveCartDisplayTotals } from "../utils/cartDisplay.utils";
import { groupItemsByVendor } from "../utils/cart.utils";
import { navigate } from "@/shared/utils/navigate";
import { clampCartQuantity } from "@/shared/constants/cart";
import { PATHS } from "@/shared/constants/paths";
import type { CartItem } from "@/shared/api/types";

export function useCartDrawer() {
  const router = useRouter();
  const isOpen = useCartDrawerStore((s) => s.isOpen);
  const close = useCartDrawerStore((s) => s.close);
  const mutationError = useCartDrawerStore((s) => s.mutationError);
  const setMutationError = useCartDrawerStore((s) => s.setMutationError);
  const { data: cart, isLoading, isFetching, isError, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const isCartMutating =
    useIsMutating({ mutationKey: cartMutationKeys.all }) > 0;

  const groupedByVendor = useMemo(() => {
    if (!cart?.items) return {} as Record<string, CartItem[]>;
    return groupItemsByVendor(cart.items);
  }, [cart]);

  const displayTotals = resolveCartDisplayTotals(cart, { isError });

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
    total: displayTotals.total,
    totalIsEstimated: displayTotals.totalIsEstimated,
    pendingLineTotals: displayTotals.pendingLineTotals,
    totalsFetching: isFetching && displayTotals.pendingLineTotals,
    isCartMutating,
    mutationError,
    dismissMutationError: () => setMutationError(null),
    pricingPreview: displayTotals.pricingPreview,
    amountsUnavailable: displayTotals.amountsUnavailable,
    retryAmounts: () => {
      void refetch();
    },
    updateQuantity,
    removeItem: removeItemById,
    continueShopping,
  };
}
