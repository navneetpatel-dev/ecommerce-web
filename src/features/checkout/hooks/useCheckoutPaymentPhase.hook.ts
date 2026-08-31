import { useState } from "react";

export type CheckoutPaymentPhase =
  | "idle"
  | "placing"
  | "verifying"
  | "restoring";

export function useCheckoutPaymentPhase() {
  const [phase, setPhase] = useState<CheckoutPaymentPhase>("idle");

  return {
    paymentPhase: phase,
    setPaymentPhase: setPhase,
    isPaymentOverlayOpen: phase !== "idle",
  };
}
