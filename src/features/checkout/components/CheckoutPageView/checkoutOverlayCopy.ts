import { LABELS } from "@/shared/constants/labels";
import type { CheckoutPaymentPhase } from "../../hooks/useCheckoutPaymentPhase.hook";

export function checkoutOverlayCopy(phase: CheckoutPaymentPhase) {
  if (phase === "verifying") {
    return {
      title: LABELS.confirmingPayment,
      description: LABELS.confirmingPaymentBody,
    };
  }
  if (phase === "restoring") {
    return {
      title: LABELS.restoringCart,
      description: LABELS.restoringCartBody,
    };
  }
  return {
    title: LABELS.placingOrder,
    description: LABELS.placingOrderBody,
  };
}
