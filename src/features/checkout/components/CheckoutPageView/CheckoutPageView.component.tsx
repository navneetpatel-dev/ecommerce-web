"use client";

import { motion } from "motion/react";
import { EmptyCart } from "../EmptyCart.component";
import { CheckoutStepIndicator } from "../../containers/CheckoutStepIndicator.container";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { CheckoutPageSkeleton } from "@/shared/components/Skeletons.component";
import { OrderSummaryPanel } from "./OrderSummaryPanel.component";
import { MobileSummaryAccordion } from "./MobileSummaryAccordion.component";
import { CheckoutStepCard } from "./CheckoutStepCard.component";
import { CheckoutPaymentNoticeDialog } from "./CheckoutPaymentNoticeDialog.component";
import { PaymentProcessingOverlay } from "../PaymentProcessingOverlay.component";
import { CheckoutTransitionState } from "./CheckoutTransitionState.component";
import { checkoutOverlayCopy } from "./checkoutOverlayCopy";
import type { CheckoutPageViewProps } from "./types";

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
  const isTransitioning = isPaymentOverlayOpen || isPending;
  const transitionPhase =
    isPending && paymentPhase === "idle" ? "placing" : paymentPhase;

  // Once placed, hold this screen even while the cart still reads as filled.
  if (paymentPhase === "redirecting" || (!hasItems && isTransitioning))
    return <CheckoutTransitionState paymentPhase={transitionPhase} />;
  if (isLoading) return <CheckoutPageSkeleton />;
  if (!hasItems) return <EmptyCart />;

  const paymentOverlay = checkoutOverlayCopy(paymentPhase);

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
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-6 md:py-8">
        {/*
          Two-column layout from the top so the summary can stick:
          left column (title + steps + form) defines row height;
          right column stretches and hosts a sticky panel.
        */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <motion.header
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            >
              <TextEyebrow brand>Checkout</TextEyebrow>
              <h1
                className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
                style={{ fontSize: "var(--text-display-sm)" }}
              >
                Complete your order
              </h1>
            </motion.header>

            <div className="mt-6 md:mt-8">
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

          <aside className="relative hidden lg:col-span-5 lg:block xl:col-span-4">
            <div className="sticky top-[88px] z-10">{summary}</div>
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
