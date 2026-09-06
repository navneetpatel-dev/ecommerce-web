"use client";

import { AnimatePresence, motion } from "motion/react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { AddressStep } from "../AddressStep.component";
import { ShippingStep } from "../ShippingStep.component";
import { PaymentStep } from "../PaymentStep.component";
import { ReviewStep } from "../ReviewStep.component";
import { CheckoutStepTransition } from "./CheckoutStepTransition.component";
import type { ShippingMethod } from "@/shared/constants/statuses";
import type { Address, CartItem, CheckoutQuote } from "@/shared/api/types";

const STEP_COPY: Record<
  number,
  { eyebrow: string; title: string; blurb: string }
> = {
  1: {
    eyebrow: "Step 1 · Address",
    title: "Where should we send it?",
    blurb: "Choose a saved address or add a new one for delivery.",
  },
  2: {
    eyebrow: "Step 2 · Shipping",
    title: "How should it arrive?",
    blurb: "Pick a shipping speed for each vendor in your bag.",
  },
  3: {
    eyebrow: "Step 3 · Payment",
    title: "How will you pay?",
    blurb: "Select a payment method, then review your order.",
  },
  4: {
    eyebrow: "Step 4 · Review",
    title: "Confirm your order",
    blurb: "One last look — totals, shipping, and taxes included.",
  },
};

interface CheckoutStepCardProps {
  step: number;
  addressId: string | null;
  shippingMethodByVendor: Record<string, ShippingMethod>;
  addresses?: Address[];
  paymentMethod?: string | null;
  walletAmountToUse: number;
  giftWrap?: boolean;
  giftMessage?: string;
  quote?: CheckoutQuote | null;
  isQuoteLoading?: boolean;
  isQuoteError?: boolean;
  quoteErrorMessage?: string;
  isPending: boolean;
  isCreatingAddress?: boolean;
  groupedByVendor: Record<string, CartItem[]>;
  shippingReady: boolean;
  hasUnavailableItems?: boolean;
  onSelectAddress: (id: string) => void;
  onSelectShipping: (vendorId: string, method: ShippingMethod) => void;
  onContinueToShipping: () => void;
  onContinueToPayment: () => void;
  onBackToShipping: () => void;
  onBackToPayment: () => void;
  onSelectPayment: (method: string) => void;
  onWalletAmountChange: (amount: number) => void;
  onGiftWrapChange?: (giftWrap: boolean) => void;
  onGiftMessageChange?: (giftMessage: string) => void;
  onContinueToReview: () => void;
  onPlaceOrder: () => void;
  onCreateAddress: (body: Omit<Address, "id" | "userId">) => Promise<void>;
}

export function CheckoutStepCard({
  step,
  addressId,
  shippingMethodByVendor,
  addresses,
  paymentMethod,
  walletAmountToUse,
  giftWrap = false,
  giftMessage = "",
  quote,
  isQuoteLoading,
  isQuoteError,
  quoteErrorMessage,
  isPending,
  isCreatingAddress,
  groupedByVendor,
  shippingReady,
  hasUnavailableItems,
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
}: CheckoutStepCardProps) {
  const copy = STEP_COPY[step] ?? STEP_COPY[1];

  return (
    <section className="mt-8 border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-7 lg:mt-10 lg:p-8">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
      >
        <TextEyebrow>{copy.eyebrow}</TextEyebrow>
        <h2 className="mt-1.5 font-display text-[1.5rem] leading-tight text-ink md:text-[1.75rem]">
          {copy.title}
        </h2>
        <p className="mt-2 max-w-[42ch] text-body text-ink-muted">
          {copy.blurb}
        </p>

        <div className="mt-6 border-t border-line pt-6 md:mt-8 md:pt-8">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <CheckoutStepTransition stepKey="address">
                <AddressStep
                  addresses={addresses}
                  selectedId={addressId}
                  isCreating={isCreatingAddress}
                  onSelect={onSelectAddress}
                  onContinue={onContinueToShipping}
                  onCreateAddress={onCreateAddress}
                />
              </CheckoutStepTransition>
            )}
            {step === 2 && (
              <CheckoutStepTransition stepKey="shipping">
                <ShippingStep
                  groupedByVendor={groupedByVendor}
                  selectedMethods={shippingMethodByVendor}
                  pincode={
                    addresses?.find((address) => address.id === addressId)
                      ?.pincode ?? ""
                  }
                  canContinue={shippingReady}
                  onSelect={onSelectShipping}
                  onContinue={onContinueToPayment}
                />
              </CheckoutStepTransition>
            )}
            {step === 3 && (
              <CheckoutStepTransition stepKey="payment">
                <PaymentStep
                  isPending={isPending}
                  selectedMethod={paymentMethod}
                  quote={quote}
                  walletAmountToUse={walletAmountToUse}
                  onSelect={onSelectPayment}
                  onWalletAmountChange={onWalletAmountChange}
                  onContinue={onContinueToReview}
                  onBack={onBackToShipping}
                />
              </CheckoutStepTransition>
            )}
            {step === 4 && (
              <CheckoutStepTransition stepKey="review">
                <ReviewStep
                  quote={quote ?? null}
                  isQuoteLoading={isQuoteLoading}
                  isQuoteError={isQuoteError}
                  quoteErrorMessage={quoteErrorMessage}
                  isPending={isPending}
                  hasUnavailableItems={hasUnavailableItems}
                  giftWrap={giftWrap}
                  giftMessage={giftMessage}
                  onGiftWrapChange={onGiftWrapChange}
                  onGiftMessageChange={onGiftMessageChange}
                  onPlaceOrder={onPlaceOrder}
                  onBack={onBackToPayment}
                />
              </CheckoutStepTransition>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
