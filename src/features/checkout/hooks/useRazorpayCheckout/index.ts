import { useRouter } from "next/navigation";
import { checkoutApi } from "../../api/checkout.api";
import { loadRazorpayScript } from "../../utils/loadRazorpayScript";
import { getRazorpayCheckoutTheme } from "../../utils/razorpayTheme";
import { getRazorpayCheckoutConfig, getRazorpayCheckoutMethods } from "../../utils/razorpayCheckoutConfig";
import { navigate } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import type { PaymentNotice } from "../usePaymentNotice/index";

export type CheckoutPaymentPhase = "idle" | "placing" | "verifying";

type PlaceOrderResult = {
  orderId: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  checkoutConfigId?: string;
};

interface LaunchRazorpayPaymentHelpers {
  router: ReturnType<typeof useRouter>;
  showNotice: (notice: PaymentNotice) => void;
  clearCartCache: () => void;
  restoreCancelledCheckout: (orderId: string, notice: PaymentNotice) => Promise<void>;
  onPhaseChange?: (phase: CheckoutPaymentPhase) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export async function launchRazorpayPayment(
  result: PlaceOrderResult,
  {
    router,
    showNotice,
    clearCartCache,
    restoreCancelledCheckout,
    onPhaseChange,
    prefill,
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

  const theme = getRazorpayCheckoutTheme();

  const rzp = new window.Razorpay({
    key: keyId,
    order_id: result.razorpayOrderId!,
    amount: result.amount,
    currency: result.currency,
    name: LABELS.brandName,
    theme,
    method: getRazorpayCheckoutMethods(),
    config: getRazorpayCheckoutConfig(),
    ...(result.checkoutConfigId || process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_CONFIG_ID
      ? {
          checkout_config_id:
            result.checkoutConfigId ||
            process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_CONFIG_ID,
        }
      : {}),
    ...(prefill ? { prefill } : {}),
    modal: {
      backdropclose: true,
      escape: true,
      handleback: true,
      animation: true,
      ondismiss: () => {
        onPhaseChange?.("idle");
        void restoreCancelledCheckout(result.orderId, {
          variant: "info",
          title: LABELS.paymentCancelledTitle,
          description: LABELS.paymentCancelledBody,
        });
      },
    },
    handler: async (response) => {
      onPhaseChange?.("verifying");
      try {
        await checkoutApi.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        clearCartCache();
        navigate(router, PATHS.orderConfirmation(result.orderId));
      } catch {
        onPhaseChange?.("idle");
        showNotice({
          variant: "warning",
          title: LABELS.paymentConfirmationPendingTitle,
          description: LABELS.paymentConfirmationPendingBody,
        });
        clearCartCache();
      }
    },
  });

  rzp.on("payment.failed", (resp) => {
    onPhaseChange?.("idle");
    void restoreCancelledCheckout(result.orderId, {
      variant: "danger",
      title: LABELS.paymentFailedTitle,
      description: resp.error?.description || LABELS.paymentFailedBody,
    });
  });

  rzp.open();
}
