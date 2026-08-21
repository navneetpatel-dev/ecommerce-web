import { useRouter } from "next/navigation";
import { checkoutApi } from "../../api/checkout.api";
import { loadRazorpayScript } from "../../utils/loadRazorpayScript";
import { navigate } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import type { PaymentNotice } from "../usePaymentNotice/index";

type PlaceOrderResult = {
  orderId: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
};

interface LaunchRazorpayPaymentHelpers {
  router: ReturnType<typeof useRouter>;
  showNotice: (notice: PaymentNotice) => void;
  clearCartCache: () => void;
  restoreCancelledCheckout: (orderId: string, notice: PaymentNotice) => Promise<void>;
}

export async function launchRazorpayPayment(
  result: PlaceOrderResult,
  {
    router,
    showNotice,
    clearCartCache,
    restoreCancelledCheckout,
  }: LaunchRazorpayPaymentHelpers,
): Promise<void> {
  await loadRazorpayScript();
  if (!window.Razorpay) {
    showNotice({
      variant: "danger",
      title: LABELS.paymentUnavailableTitle,
      description: LABELS.paymentUnavailableLoadScript,
    });
    return;
  }

  const keyId = result.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  if (!keyId || !result.amount || !result.currency) {
    showNotice({
      variant: "danger",
      title: LABELS.paymentUnavailableTitle,
      description: LABELS.paymentUnavailableMissingDetails,
    });
    return;
  }

  const rzp = new window.Razorpay({
    key: keyId,
    order_id: result.razorpayOrderId!,
    amount: result.amount,
    currency: result.currency,
    name: LABELS.brandName,
    handler: async (response) => {
      try {
        await checkoutApi.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        clearCartCache();
        navigate(router, PATHS.orderConfirmation(result.orderId));
      } catch {
        showNotice({
          variant: "warning",
          title: LABELS.paymentConfirmationPendingTitle,
          description: LABELS.paymentConfirmationPendingBody,
        });
        clearCartCache();
      }
    },
    modal: {
      ondismiss: () => {
        void restoreCancelledCheckout(result.orderId, {
          variant: "info",
          title: LABELS.paymentCancelledTitle,
          description: LABELS.paymentCancelledBody,
        });
      },
    },
  });

  rzp.on("payment.failed", (resp) => {
    void restoreCancelledCheckout(result.orderId, {
      variant: "danger",
      title: LABELS.paymentFailedTitle,
      description: resp.error?.description || LABELS.paymentFailedBody,
    });
  });

  rzp.open();
}
