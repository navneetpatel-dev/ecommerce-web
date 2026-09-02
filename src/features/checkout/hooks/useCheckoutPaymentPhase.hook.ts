import { useState } from "react";

export type CheckoutPaymentPhase =
  | "idle"
  | "placing"
  | "verifying"
  /** Order is placed; waiting for the route change to the confirmation page. */
  | "redirecting"
  | "restoring";

export function useCheckoutPaymentPhase() {
  const [phase, setPhase] = useState<CheckoutPaymentPhase>("idle");

  return {
    paymentPhase: phase,
    setPaymentPhase: setPhase,
    isPaymentOverlayOpen: phase !== "idle",
  };
}
