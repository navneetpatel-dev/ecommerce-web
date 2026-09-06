"use client";

import { useMemo } from "react";
import { useIsMutating } from "@tanstack/react-query";
import {
  cartMutationKeys,
  useCart,
  useClearCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "../api/cart.queries";
import { groupItemsByVendor } from "../utils/cart.utils";
import { useCartCoupons } from "./useCartCoupons.hook";
import { resolveCartDisplayTotals } from "../utils/cartDisplay.utils";
import { clampCartQuantity } from "@/shared/constants/cart";
import type { CartItem } from "@/shared/api/types";
import { useCartDrawerStore } from "../store/cart.store";

export function useCartPage() {
  const { data: cart, isLoading, isError, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const mutationError = useCartDrawerStore((state) => state.mutationError);
  const setMutationError = useCartDrawerStore(
    (state) => state.setMutationError,
  );
  const isCartMutating =
    useIsMutating({ mutationKey: cartMutationKeys.all }) > 0;
  const coupons = useCartCoupons({ cart, enabled: true });

  const items = useMemo(() => cart?.items ?? [], [cart?.items]);
  const hasItems = items.length > 0;
  const itemCount = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
  const hasUnavailableItems = items.some((item) => item.isAvailable === false);

  const groupedByVendor = useMemo(
    () => (hasItems ? groupItemsByVendor(items) : {}),
    [hasItems, items],
  );

  const displayTotals = resolveCartDisplayTotals(cart, { isError });

  const vendorDiscountBreakdown = useMemo(() => {
    const shares = cart?.appliedCoupon?.vendorDiscountShares;
    if (!shares || !hasItems) return [];
    return Object.entries(shares)
      .filter(([, amount]) => Number(amount) > 0)
      .map(([vendorId, amount]) => {
        const vendorItems = groupedByVendor[vendorId] ?? [];
        const name =
          vendorItems[0]?.product?.vendor?.businessName ??
          vendorItems[0]?.product?.vendor?.slug ??
          vendorId;
        return { vendorId, name, amount: Number(amount) };
      });
  }, [cart?.appliedCoupon?.vendorDiscountShares, groupedByVendor, hasItems]);

  const updateQuantity = (itemId: string, quantity: number) =>
    updateItem.mutate({ itemId, quantity: clampCartQuantity(quantity) });
  const removeItemById = (itemId: string) => removeItem.mutate(itemId);

  return {
    isLoading,
    hasItems,
    itemCount,
    hasUnavailableItems,
    groupedByVendor,
    subtotal: displayTotals.subtotal,
    subtotalPending: displayTotals.subtotalPending,
    total: displayTotals.total,
    totalIsEstimated: displayTotals.totalIsEstimated,
    pendingLineTotals: displayTotals.pendingLineTotals,
    pricingPreview: displayTotals.pricingPreview,
    amountsUnavailable: displayTotals.amountsUnavailable,
    retryAmounts: () => {
      void refetch();
    },
    vendorDiscountBreakdown,
    updateQuantity,
    removeItem: removeItemById,
    clearCart: () => clearCart.mutate(),
    isClearing: clearCart.isPending,
    isCartMutating,
    mutationError,
    dismissMutationError: () => setMutationError(null),
    couponInput: coupons.couponInput,
    setCouponInput: coupons.setCouponInput,
    couponMessage: coupons.couponMessage,
    couponError: coupons.couponError,
    couponPending: coupons.couponPending,
    appliedCouponCode: coupons.appliedCouponCode,
    appliedDiscount: coupons.appliedDiscount,
    appliedCoupons: coupons.appliedCoupons,
    appliedCashbackAmount: Number(cart?.appliedCoupon?.cashbackAmount ?? 0),
    payNowGrandTotal: cart?.appliedCoupon?.payNowGrandTotal,
    appliedCouponType: cart?.appliedCoupon?.type ?? null,
    eligible: coupons.eligible,
    eligibleLoading: coupons.eligibleLoading,
    applyCoupon: coupons.applyCoupon,
    applyEligible: coupons.applyEligible,
    removeCoupon: coupons.removeCoupon,
  };
}

export type CartPageGroupedItems = Record<string, CartItem[]>;
