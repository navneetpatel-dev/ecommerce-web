"use client";

import { useMemo } from "react";
import type { CheckoutPaymentPhase } from "../../hooks/useCheckoutPaymentPhase.hook";
import { checkoutOverlayCopy } from "./checkoutOverlayCopy";

interface UseCheckoutPageViewParams {
  isPaymentOverlayOpen?: boolean;
  isPending: boolean;
  paymentPhase?: CheckoutPaymentPhase;
  hasItems: boolean;
}

export function useCheckoutPageView({
  isPaymentOverlayOpen = false,
  isPending,
  paymentPhase = "idle",
  hasItems,
}: UseCheckoutPageViewParams) {
  const isTransitioning = isPaymentOverlayOpen || isPending;
  const transitionPhase =
    isPending && paymentPhase === "idle" ? "placing" : paymentPhase;

  const showTransitionScreen =
    paymentPhase === "redirecting" || (!hasItems && isTransitioning);

  const paymentOverlay = useMemo(() => {
    return checkoutOverlayCopy(paymentPhase);
  }, [paymentPhase]);

  return {
    isTransitioning,
    transitionPhase,
    showTransitionScreen,
    paymentOverlay,
  };
}
