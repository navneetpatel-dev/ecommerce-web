"use client";

import { motion } from "motion/react";
import { EmptyCartState } from "@/shared/components/EmptyCartState.component";
import { CheckoutStepIndicator } from "../../../containers/page-view/CheckoutStepIndicator.container";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { CheckoutPageSkeleton } from "@/shared/components/Skeletons.component";
import { OrderSummaryPanel } from "./OrderSummaryPanel.component";
import { MobileSummaryAccordion } from "./MobileSummaryAccordion.component";
import { CheckoutStepCard } from "./CheckoutStepCard.component";
import { CheckoutPaymentNoticeDialog } from "./CheckoutPaymentNoticeDialog.component";
import { PaymentProcessingOverlay } from "../../payment/PaymentProcessingOverlay.component";
import { CheckoutTransitionState } from "./CheckoutTransitionState.component";
import { useCheckoutPageView } from "../../../hooks/page-view/useCheckoutPageView.hook";
import { CHECKOUT_PAGE_VIEW_STYLES } from "../../../styles/page-view/checkoutPageView.styles";
import type { CheckoutPageViewProps } from "../../../types/page-view/types";

export function CheckoutPageView({
  isLoading,
  hasItems,
  step,
  addressId,
  shippingMethodByVendor,
  addresses,
  paymentMethod,
  walletAmountToUse = 0,
  giftWrap = false,
  giftMessage = "",
  quote,
  isQuoteLoading,
  isQuoteError,
  quoteErrorMessage,
  isPending,
  paymentPhase = "idle",
  isPaymentOverlayOpen = false,
  paymentNotice,
  onClearPaymentNotice,
  isCreatingAddress,
  groupedByVendor,
  subtotal,
  subtotalPending = false,
  amountsUnavailable = false,
  onRetryAmounts,
  estimatedTotal,
  estimatedTotalPending = false,
  cartPricingPreview,
  shippingReady,
  hasUnavailableItems,
  onStepClick,
  onSelectAddress,
  onSelectShipping,
  onContinueToShipping,
  onContinueToPayment,
  onBackToShipping,
  onBackToPayment,
  onSelectPayment,
  onWalletAmountChange,
  onGiftWrapChange,
  onGiftMessageChange,
  onContinueToReview,
  onPlaceOrder,
  onCreateAddress,
}: CheckoutPageViewProps) {
  const { transitionPhase, showTransitionScreen, paymentOverlay } =
    useCheckoutPageView({
      isPaymentOverlayOpen,
      isPending,
      paymentPhase,
      hasItems,
    });

  if (showTransitionScreen) {
    return <CheckoutTransitionState paymentPhase={transitionPhase} />;
  }

  if (isLoading) return <CheckoutPageSkeleton />;

  if (!hasItems) {
    return (
      <EmptyCartState
        heading="Nothing to check out"
        message="Your bag is empty — add a few pieces, then return here to complete your order."
      />
    );
  }

  const summary = (
    <OrderSummaryPanel
      groupedByVendor={groupedByVendor}
      subtotal={subtotal}
      subtotalPending={subtotalPending}
      amountsUnavailable={amountsUnavailable}
      onRetryAmounts={onRetryAmounts}
      estimatedTotal={estimatedTotal}
      estimatedTotalPending={estimatedTotalPending}
      quote={quote}
      cartPricingPreview={cartPricingPreview}
    />
  );

  return (
    <div className={CHECKOUT_PAGE_VIEW_STYLES.root}>
      <div aria-hidden className={CHECKOUT_PAGE_VIEW_STYLES.radialBackground} />

      <div className={CHECKOUT_PAGE_VIEW_STYLES.container}>
        <div className={CHECKOUT_PAGE_VIEW_STYLES.layoutGrid}>
          <div className={CHECKOUT_PAGE_VIEW_STYLES.mainCol}>
            <motion.header
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            >
              <TextEyebrow brand>Checkout</TextEyebrow>
              <h1
                className={CHECKOUT_PAGE_VIEW_STYLES.heading}
                style={CHECKOUT_PAGE_VIEW_STYLES.headingStyle}
              >
                Complete your order
              </h1>
            </motion.header>

            <div className={CHECKOUT_PAGE_VIEW_STYLES.stepIndicatorContainer}>
              <CheckoutStepIndicator
                currentStep={step}
                onStepClick={onStepClick}
              />
            </div>

            <MobileSummaryAccordion
              summary={summary}
              estimatedTotal={estimatedTotal}
              estimatedTotalPending={estimatedTotalPending}
              quote={quote}
            />

            <CheckoutStepCard
              step={step}
              addressId={addressId}
              shippingMethodByVendor={shippingMethodByVendor}
              addresses={addresses}
              paymentMethod={paymentMethod}
              walletAmountToUse={walletAmountToUse}
              giftWrap={giftWrap}
              giftMessage={giftMessage}
              quote={quote}
              isQuoteLoading={isQuoteLoading}
              isQuoteError={isQuoteError}
              quoteErrorMessage={quoteErrorMessage}
              isPending={isPending}
              isCreatingAddress={isCreatingAddress}
              groupedByVendor={groupedByVendor}
              shippingReady={shippingReady}
              hasUnavailableItems={hasUnavailableItems}
              onSelectAddress={onSelectAddress}
              onSelectShipping={onSelectShipping}
              onContinueToShipping={onContinueToShipping}
              onContinueToPayment={onContinueToPayment}
              onBackToShipping={onBackToShipping}
              onBackToPayment={onBackToPayment}
              onSelectPayment={onSelectPayment}
              onWalletAmountChange={onWalletAmountChange}
              onGiftWrapChange={onGiftWrapChange}
              onGiftMessageChange={onGiftMessageChange}
              onContinueToReview={onContinueToReview}
              onPlaceOrder={onPlaceOrder}
              onCreateAddress={onCreateAddress}
            />
          </div>

          <aside className={CHECKOUT_PAGE_VIEW_STYLES.aside}>
            <div className={CHECKOUT_PAGE_VIEW_STYLES.stickyAsideContent}>
              {summary}
            </div>
          </aside>
        </div>
      </div>

      <CheckoutPaymentNoticeDialog
        paymentNotice={paymentNotice}
        onClearPaymentNotice={onClearPaymentNotice}
      />

      <PaymentProcessingOverlay
        open={isPaymentOverlayOpen}
        title={paymentOverlay.title}
        description={paymentOverlay.description}
      />
    </div>
  );
}
