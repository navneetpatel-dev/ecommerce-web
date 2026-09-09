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
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { useCheckoutAddresses } from "./useCheckoutAddresses.hook";
import {
  canAdvanceFromPayment,
  hasUnavailableCartItems,
  isShippingReadyForAllVendors,
} from "../utils/checkoutDerivedState";
import { useCheckoutStepGuards } from "./useCheckoutStepGuards.hook";

/**
 * Checkout flow orchestration (Rule 3: address concern lives in
 * `useCheckoutAddresses`, order placement in `usePlaceOrderWithRazorpay`).
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
  const {
    handlePlaceOrder,
    quote,
    isQuoteLoading,
    isQuoteError,
    quoteErrorMessage,
    isPending,
    paymentPhase,
    isPaymentOverlayOpen,
    paymentNotice,
    clearPaymentNotice,
  } = usePlaceOrderWithRazorpay();
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
    quote,
    setPaymentMethod,
    setWalletAmountToUse,
  });

  const displayTotals = resolveCartDisplayTotals(cart, { isError: cartError });
  const subtotal = displayTotals.subtotal;
  const subtotalPending = displayTotals.subtotalPending;
  const estimatedTotal = quote?.grandTotal ?? displayTotals.total;
  const estimatedTotalPending = !quote && displayTotals.totalIsEstimated;
  const amountsUnavailable = displayTotals.amountsUnavailable;

  const shippingReady = useMemo(
    () => isShippingReadyForAllVendors(groupedByVendor, shippingMethodByVendor),
    [groupedByVendor, shippingMethodByVendor],
  );

  const canAdvance = () =>
    canAdvanceFromPayment(paymentMethod, quote, walletAmountToUse);

  const onStepClick = (nextStep: number) => {
    if (nextStep < step) setStep(nextStep as 1 | 2 | 3 | 4);
  };

  const onContinueToShipping = () => setStep(2);
  const onContinueToPayment = () => setStep(3);
  const onBackToShipping = () => setStep(2);
  const onBackToPayment = () => setStep(3);

  const onContinueToReview = () => {
    if (!canAdvance()) return;
    setStep(4);
  };

  const onPlaceOrder = () => {
    if (!canAdvance()) return;
    if (
      !requireAuth({
        title: LABELS.completeYourOrderTitle,
        message: LABELS.completeYourOrderMessage,
        redirectTo: PATHS.checkout,
      })
    ) {
      return;
    }
    void handlePlaceOrder(paymentMethod!);
  };

  return {
    step,
    addressId: addressesState.addressId,
    shippingMethodByVendor,
    paymentMethod,
    walletAmountToUse,
    giftWrap,
    giftMessage,
    addresses: addressesState.addresses,
    quote,
    isQuoteLoading,
    isQuoteError,
    quoteErrorMessage,
    isPending,
    paymentPhase,
    isPaymentOverlayOpen,
    paymentNotice,
    clearPaymentNotice,
    isLoading,
    groupedByVendor,
    subtotal,
    subtotalPending,
    estimatedTotal,
    estimatedTotalPending,
    amountsUnavailable,
    retryAmounts: () => {
      void refetchCart();
    },
    hasItems: Boolean(cart?.items?.length),
    cartPricingPreview: displayTotals.pricingPreview,
    hasUnavailableItems,
    shippingReady,
    isCreatingAddress: addressesState.isCreatingAddress,
    onStepClick,
    onSelectAddress: addressesState.onSelectAddress,
    onSelectShipping: setShippingMethod,
    onContinueToShipping,
    onContinueToPayment,
    onBackToShipping,
    onBackToPayment,
    onSelectPayment: setPaymentMethod,
    onWalletAmountChange: setWalletAmountToUse,
    onGiftWrapChange: setGiftWrap,
    onGiftMessageChange: setGiftMessage,
    onContinueToReview,
    onPlaceOrder,
    onCreateAddress: addressesState.onCreateAddress,
  };
}
