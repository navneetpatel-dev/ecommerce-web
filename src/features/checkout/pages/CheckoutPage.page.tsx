"use client";

import { useCheckoutPage } from "../hooks/useCheckoutPage.hook";
import { CheckoutPageView } from "../components/CheckoutPageView";

export function CheckoutPage() {
  const checkout = useCheckoutPage();

  return (
    <CheckoutPageView
      isLoading={checkout.isLoading}
      hasItems={checkout.hasItems}
      step={checkout.step}
      addressId={checkout.addressId}
      shippingMethodByVendor={checkout.shippingMethodByVendor}
      addresses={checkout.addresses}
      paymentMethod={checkout.paymentMethod}
      walletAmountToUse={checkout.walletAmountToUse}
      quote={checkout.quote}
      isQuoteLoading={checkout.isQuoteLoading}
      isQuoteError={checkout.isQuoteError}
      quoteErrorMessage={checkout.quoteErrorMessage}
      isPending={checkout.isPending}
      paymentPhase={checkout.paymentPhase}
      isPaymentOverlayOpen={checkout.isPaymentOverlayOpen}
      paymentNotice={checkout.paymentNotice}
      onClearPaymentNotice={checkout.clearPaymentNotice}
      isCreatingAddress={checkout.isCreatingAddress}
      groupedByVendor={checkout.groupedByVendor}
      subtotal={checkout.subtotal}
      estimatedTotal={checkout.estimatedTotal}
      shippingReady={checkout.shippingReady}
      hasUnavailableItems={checkout.hasUnavailableItems}
      onStepClick={checkout.onStepClick}
      onSelectAddress={checkout.onSelectAddress}
      onSelectShipping={checkout.onSelectShipping}
      onContinueToShipping={checkout.onContinueToShipping}
      onContinueToPayment={checkout.onContinueToPayment}
      onBackToShipping={checkout.onBackToShipping}
      onBackToPayment={checkout.onBackToPayment}
      onSelectPayment={checkout.onSelectPayment}
      onWalletAmountChange={checkout.onWalletAmountChange}
      onContinueToReview={checkout.onContinueToReview}
      onPlaceOrder={checkout.onPlaceOrder}
      onCreateAddress={checkout.onCreateAddress}
    />
  );
}
