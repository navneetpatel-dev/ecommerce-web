"use client";

import { useMemo } from "react";
import {
  useCart,
  groupItemsByVendor,
  resolveCartDisplayTotals,
} from "@/features/cart";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { usePlaceOrderWithRazorpay } from "./usePlaceOrder.hook";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth.hook";
import { useCheckoutAddresses } from "./useCheckoutAddresses.hook";
import {
  canAdvanceFromPayment,
  hasUnavailableCartItems,
  isShippingReadyForAllVendors,
  resolveCheckoutPageTotals,
} from "../utils/checkoutDerivedState";
import { useCheckoutStepGuards } from "./useCheckoutStepGuards.hook";
import { useCheckoutStepNavigation } from "./useCheckoutStepNavigation.hook";

/**
 * Checkout flow orchestration (Rule 3: address concern lives in
 * `useCheckoutAddresses`, step navigation in `useCheckoutStepNavigation`,
 * order placement in `usePlaceOrderWithRazorpay`).
 */
export function useCheckoutPage() {
  const {
    step,
    shippingMethodByVendor,
    paymentMethod,
    setStep,
    setShippingMethod,
    ensureDefaultShippingMethods,
    setPaymentMethod,
    walletAmountToUse,
    setWalletAmountToUse,
    giftWrap,
    giftMessage,
    setGiftWrap,
    setGiftMessage,
  } = useCheckoutStore();
  const {
    data: cart,
    isLoading: cartLoading,
    isError: cartError,
    refetch: refetchCart,
  } = useCart();
  const orderPlacement = usePlaceOrderWithRazorpay();
  const { requireAuth } = useRequireAuth();
  const addressesState = useCheckoutAddresses();

  const isLoading = cartLoading || addressesState.isLoadingAddresses;

  const groupedByVendor = useMemo(() => {
    if (!cart?.items) return {};
    return groupItemsByVendor(cart.items);
  }, [cart]);

  const hasUnavailableItems = useMemo(
    () => hasUnavailableCartItems(cart?.items),
    [cart],
  );

  useCheckoutStepGuards({
    groupedByVendor,
    ensureDefaultShippingMethods,
    paymentMethod,
    quote: orderPlacement.quote,
    setPaymentMethod,
    setWalletAmountToUse,
  });

  const displayTotals = resolveCartDisplayTotals(cart, { isError: cartError });
  const totals = resolveCheckoutPageTotals(displayTotals, orderPlacement.quote);

  const shippingReady = useMemo(
    () => isShippingReadyForAllVendors(groupedByVendor, shippingMethodByVendor),
    [groupedByVendor, shippingMethodByVendor],
  );

  const canAdvance = () =>
    canAdvanceFromPayment(
      paymentMethod,
      orderPlacement.quote,
      walletAmountToUse,
    );

  const navigation = useCheckoutStepNavigation({
    step,
    setStep,
    canAdvance,
    paymentMethod,
    requireAuth,
    handlePlaceOrder: orderPlacement.handlePlaceOrder,
  });

  return {
    step,
    addressId: addressesState.addressId,
    shippingMethodByVendor,
    paymentMethod,
    walletAmountToUse,
    giftWrap,
    giftMessage,
    addresses: addressesState.addresses,
    quote: orderPlacement.quote,
    isQuoteLoading: orderPlacement.isQuoteLoading,
    isQuoteError: orderPlacement.isQuoteError,
    quoteErrorMessage: orderPlacement.quoteErrorMessage,
    isPending: orderPlacement.isPending,
    paymentPhase: orderPlacement.paymentPhase,
    isPaymentOverlayOpen: orderPlacement.isPaymentOverlayOpen,
    paymentNotice: orderPlacement.paymentNotice,
    clearPaymentNotice: orderPlacement.clearPaymentNotice,
    isLoading,
    groupedByVendor,
    subtotal: totals.subtotal,
    subtotalPending: totals.subtotalPending,
    estimatedTotal: totals.estimatedTotal,
    estimatedTotalPending: totals.estimatedTotalPending,
    amountsUnavailable: totals.amountsUnavailable,
    retryAmounts: () => {
      void refetchCart();
    },
    hasItems: Boolean(cart?.items?.length),
    cartPricingPreview: displayTotals.pricingPreview,
    hasUnavailableItems,
    shippingReady,
    isCreatingAddress: addressesState.isCreatingAddress,
    onStepClick: navigation.onStepClick,
    onSelectAddress: addressesState.onSelectAddress,
    onSelectShipping: setShippingMethod,
    onContinueToShipping: navigation.onContinueToShipping,
    onContinueToPayment: navigation.onContinueToPayment,
    onBackToShipping: navigation.onBackToShipping,
    onBackToPayment: navigation.onBackToPayment,
    onSelectPayment: setPaymentMethod,
    onWalletAmountChange: setWalletAmountToUse,
    onGiftWrapChange: setGiftWrap,
    onGiftMessageChange: setGiftMessage,
    onContinueToReview: navigation.onContinueToReview,
    onPlaceOrder: navigation.onPlaceOrder,
    onCreateAddress: addressesState.onCreateAddress,
  };
}
