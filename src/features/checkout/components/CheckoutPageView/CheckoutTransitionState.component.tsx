"use client";

import { CheckoutPageSkeleton } from "@/shared/components/Skeletons.component";
import { PaymentProcessingOverlay } from "../PaymentProcessingOverlay.component";
import type { CheckoutPaymentPhase } from "../../hooks/useCheckoutPaymentPhase.hook";
import { checkoutOverlayCopy } from "./checkoutOverlayCopy";

interface CheckoutTransitionStateProps {
  paymentPhase: CheckoutPaymentPhase;
}

/** Skeleton + overlay while order completes and before route change (avoids empty-cart flash). */
export function CheckoutTransitionState({
  paymentPhase,
}: CheckoutTransitionStateProps) {
  const copy = checkoutOverlayCopy(paymentPhase);
  return (
    <>
      <CheckoutPageSkeleton />
      <PaymentProcessingOverlay
        open
        title={copy.title}
        description={copy.description}
      />
    </>
  );
}
