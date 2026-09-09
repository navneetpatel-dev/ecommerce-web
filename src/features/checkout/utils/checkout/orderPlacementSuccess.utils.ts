import type { useRouter } from "next/navigation";
import { navigate } from "@/shared/utils/navigation/navigate";
import { PATHS } from "@/shared/constants/paths/paths";
import { launchRazorpayPayment } from "../../hooks/payment/useRazorpayCheckout/index";
import type { PlaceOrderResult } from "../../hooks/payment/useRazorpayCheckout/types";
import type { PaymentNotice } from "../../hooks/payment/usePaymentNotice/index";
import type { CheckoutPaymentPhase } from "../../hooks/payment/useCheckoutPaymentPhase.hook";

interface HandleOrderPlacementSuccessOptions {
  result: PlaceOrderResult;
  apiPaymentMethod: string;
  router: ReturnType<typeof useRouter>;
  currentUser: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  showNotice: (notice: PaymentNotice) => void;
  clearCartCache: () => void;
  onOrderPlaced: () => void;
  restoreCancelledCheckout: (
    orderId: string,
    notice: PaymentNotice | null,
    options?: { silent?: boolean },
  ) => Promise<void>;
  setPaymentPhase: (phase: CheckoutPaymentPhase) => void;
  clearPendingOrder: (orderId?: string) => void;
}

export async function handleOrderPlacementSuccess({
  result,
  apiPaymentMethod,
  router,
  currentUser,
  showNotice,
  clearCartCache,
  onOrderPlaced,
  restoreCancelledCheckout,
  setPaymentPhase,
  clearPendingOrder,
}: HandleOrderPlacementSuccessOptions) {
  if (apiPaymentMethod === "razorpay" && result.razorpayOrderId) {
    setPaymentPhase("idle");
    await launchRazorpayPayment(result, {
      router,
      showNotice,
      clearCartCache,
      onOrderPlaced,
      restoreCancelledCheckout,
      onPhaseChange: setPaymentPhase,
      onCheckoutComplete: clearPendingOrder,
      prefill: {
        name: currentUser?.name ?? undefined,
        email: currentUser?.email ?? undefined,
        contact: currentUser?.phone ?? undefined,
      },
    });
    return;
  }

  clearPendingOrder(result.orderId);
  setPaymentPhase("redirecting");
  onOrderPlaced();
  navigate(router, PATHS.orderConfirmation(result.orderId));
}
