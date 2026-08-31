"use client";

import { useEffect, useMemo } from "react";
import { useCart } from "@/features/cart";
import { groupItemsByVendor, calcCartTotal } from "@/features/cart";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { usePlaceOrderWithRazorpay } from "./usePlaceOrder.hook";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth.hook";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { useCheckoutAddresses } from "./useCheckoutAddresses.hook";

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
  } = useCheckoutStore();
  const { data: cart, isLoading: cartLoading } = useCart();
  const {
    handlePlaceOrder,
    quote,
    isQuoteLoading,
    isQuoteError,
    quoteErrorMessage,
    isPending,
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
    () => (cart?.items ?? []).some((item) => item.isAvailable === false),
    [cart],
  );

  // Default every vendor to Standard (Free) when shipping methods are missing
  const defaultShippingMethods = () => {
    const vendorIds = Object.keys(groupedByVendor);
    if (!vendorIds.length) return;
    ensureDefaultShippingMethods(vendorIds);
  };
  useEffect(defaultShippingMethods, [
    groupedByVendor,
    ensureDefaultShippingMethods,
  ]);

  useEffect(() => {
    if (paymentMethod === "cod" && quote && quote.codAvailable === false) {
      setPaymentMethod(null);
    }
  }, [paymentMethod, quote, setPaymentMethod]);

  const total = useMemo(() => {
    if (!cart?.items) return 0;
    return calcCartTotal(cart.items);
  }, [cart]);

  const shippingReady = useMemo(
    () =>
      Object.keys(groupedByVendor).every((vendorId) =>
        Boolean(shippingMethodByVendor[vendorId]),
      ),
    [groupedByVendor, shippingMethodByVendor],
  );

  const canAdvanceFromPayment = () =>
    Boolean(paymentMethod) &&
    !(paymentMethod === "cod" && quote?.codAvailable !== true);

  const onStepClick = (nextStep: number) => {
    if (nextStep < step) setStep(nextStep as 1 | 2 | 3 | 4);
  };

  const onContinueToShipping = () => setStep(2);
  const onContinueToPayment = () => setStep(3);
  const onBackToShipping = () => setStep(2);
  const onBackToPayment = () => setStep(3);

  const onContinueToReview = () => {
    if (!canAdvanceFromPayment()) return;
    setStep(4);
  };

  const onPlaceOrder = () => {
    if (!canAdvanceFromPayment()) return;
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
    addresses: addressesState.addresses,
    quote,
    isQuoteLoading,
    isQuoteError,
    quoteErrorMessage,
    isPending,
    paymentNotice,
    clearPaymentNotice,
    isLoading,
    groupedByVendor,
    total,
    hasItems: Boolean(cart?.items?.length),
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
    onContinueToReview,
    onPlaceOrder,
    onCreateAddress: addressesState.onCreateAddress,
  };
}
