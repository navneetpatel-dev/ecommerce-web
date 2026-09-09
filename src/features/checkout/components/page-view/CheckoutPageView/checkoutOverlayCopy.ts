import { LABELS } from "@/shared/constants/labels";
import type { CheckoutPaymentPhase } from "../../../hooks/payment/useCheckoutPaymentPhase.hook";

export function checkoutOverlayCopy(phase: CheckoutPaymentPhase) {
  if (phase === "verifying") {
    return {
      title: LABELS.confirmingPayment,
      description: LABELS.confirmingPaymentBody,
    };
  }
  if (phase === "redirecting") {
    return {
      title: LABELS.orderPlacedRedirect,
      description: LABELS.orderPlacedRedirectBody,
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
