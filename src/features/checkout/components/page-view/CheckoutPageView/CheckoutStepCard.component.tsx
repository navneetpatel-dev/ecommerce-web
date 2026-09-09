"use client";

import { AnimatePresence, motion } from "motion/react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { AddressStep } from "../../address/AddressStep.component";
import { ShippingStep } from "../../shipping/ShippingStep.component";
import { PaymentStep } from "../../payment/PaymentStep.component";
import { ReviewStep } from "../../review/ReviewStep.component";
import { CheckoutStepTransition } from "./CheckoutStepTransition.component";
import type { ShippingMethod } from "@/shared/constants/statuses";
import type { Address, CartItem, CheckoutQuote } from "@/shared/api/types";
import { useCheckoutStepCard } from "../../../hooks/page-view/useCheckoutStepCard.hook";
import { CHECKOUT_STEP_CARD_STYLES } from "../../../styles/page-view/checkoutStepCard.styles";

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
  const { copy, pincode } = useCheckoutStepCard({
    step,
    addressId,
    addresses,
  });

  return (
    <section className={CHECKOUT_STEP_CARD_STYLES.card}>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
      >
        <TextEyebrow>{copy.eyebrow}</TextEyebrow>
        <h2 className={CHECKOUT_STEP_CARD_STYLES.title}>{copy.title}</h2>
        <p className={CHECKOUT_STEP_CARD_STYLES.blurb}>{copy.blurb}</p>

        <div className={CHECKOUT_STEP_CARD_STYLES.stepContentContainer}>
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
                  pincode={pincode}
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
