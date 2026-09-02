"use client";

import { useMemo } from "react";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "../api/cart.queries";
import { groupItemsByVendor } from "../utils/cart.utils";
import { useCartCoupons } from "./useCartCoupons.hook";
import { resolveCartDisplayTotals } from "../utils/cartDisplay.utils";
import { clampCartQuantity } from "@/shared/constants/cart";
import type { CartItem } from "@/shared/api/types";

export function useCartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const coupons = useCartCoupons({ cart, enabled: true });

  const items = cart?.items ?? [];
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

  const displayTotals = resolveCartDisplayTotals(cart);

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
    vendorDiscountBreakdown,
    updateQuantity,
    removeItem: removeItemById,
    couponInput: coupons.couponInput,
    setCouponInput: coupons.setCouponInput,
    couponMessage: coupons.couponMessage,
    couponError: coupons.couponError,
    couponPending: coupons.couponPending,
    appliedCouponCode: coupons.appliedCouponCode,
    appliedDiscount: coupons.appliedDiscount,
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
