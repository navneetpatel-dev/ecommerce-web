"use client";

import { CheckoutPageSkeleton } from "@/shared/components/Skeletons.component";
import { PaymentProcessingOverlay } from "../PaymentProcessingOverlay.component";
import type { CheckoutPaymentPhase } from "../../hooks/useCheckoutPaymentPhase.hook";
import { checkoutOverlayCopy } from "./checkoutOverlayCopy";

interface CheckoutTransitionStateProps {
  paymentPhase: CheckoutPaymentPhase;
}

/** Holds the screen steady between a placed order and the confirmation route. */
export function CheckoutTransitionState({
  paymentPhase,
}: CheckoutTransitionStateProps) {
  const copy = checkoutOverlayCopy(paymentPhase);

  /**
   * Once the order is placed the checkout content is gone for good, so a
   * skeleton behind the translucent overlay just reads as a flash of a page
   * that will never render. Paint an opaque surface instead and let the
   * confirmation route's own loading UI take over.
   */
  const isRedirecting = paymentPhase === "redirecting";

  return (
    <>
      {isRedirecting ? (
        <div className="fixed inset-0 z-40 bg-surface" aria-hidden />
      ) : (
        <CheckoutPageSkeleton />
      )}
      <PaymentProcessingOverlay
        open
        title={copy.title}
        description={copy.description}
      />
    </>
  );
}
