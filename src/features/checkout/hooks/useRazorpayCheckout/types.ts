import type { useRouter } from "next/navigation";
import type { PaymentNotice } from "../usePaymentNotice/index";
import type { CheckoutPaymentPhase } from "../useCheckoutPaymentPhase.hook";

export type PlaceOrderResult = {
  orderId: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  checkoutConfigId?: string;
  /** Seeds Razorpay Checkout's own saved-methods UI for returning shoppers. */
  razorpayCustomerId?: string;
};

export interface LaunchRazorpayPaymentHelpers {
  router: ReturnType<typeof useRouter>;
  showNotice: (notice: PaymentNotice) => void;
  clearCartCache: () => void;
  /** Post-success cache update: marks the cart stale without refetching it. */
  onOrderPlaced: () => void;
  restoreCancelledCheckout: (
    orderId: string,
    notice: PaymentNotice | null,
    options?: { silent?: boolean },
  ) => Promise<void>;
  onPhaseChange?: (phase: CheckoutPaymentPhase) => void;
  onCheckoutComplete?: (orderId: string) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}
