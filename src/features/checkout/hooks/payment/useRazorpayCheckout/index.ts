import { checkoutApi } from "../../../api/checkout/checkout.api";
import { loadRazorpayScript } from "../../../utils/payment/loadRazorpayScript";
import { getRazorpayCheckoutTheme } from "../../../utils/payment/razorpayTheme";
import {
  getRazorpayCheckoutConfig,
  getRazorpayCheckoutMethods,
} from "../../../utils/payment/razorpayCheckoutConfig";
import { navigate } from "@/shared/utils/navigation/navigate";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { ERROR_CODES } from "@/shared/constants/http/errors";
import { isApiErrorCode } from "@/shared/types/apiError.types";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { CheckoutPaymentPhase } from "../useCheckoutPaymentPhase.hook";
import type { PlaceOrderResult, LaunchRazorpayPaymentHelpers } from "./types";

export type { CheckoutPaymentPhase };
export type { PlaceOrderResult, LaunchRazorpayPaymentHelpers } from "./types";

export async function launchRazorpayPayment(
  result: PlaceOrderResult,
  {
    router,
    showNotice,
    clearCartCache,
    onOrderPlaced,
    restoreCancelledCheckout,
    onPhaseChange,
    onCheckoutComplete,
    keepOrderOnDismiss,
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

  const keyId = result.keyId ?? "";
  if (!keyId || !result.amount || !result.currency) {
    showNotice({
      variant: "danger",
      title: LABELS.paymentUnavailableTitle,
      description: LABELS.paymentUnavailableMissingDetails,
    });
    return;
  }

  const theme = getRazorpayCheckoutTheme();
  // A failed attempt leaves Razorpay's window open for a retry on the same order, so it
  // is only remembered here; the order is cancelled when the customer closes the window.
  let lastFailure: string | null = null;

  const goToConfirmation = () => {
    onCheckoutComplete?.(result.orderId);
    onOrderPlaced();
    navigate(router, PATHS.orderConfirmation(result.orderId));
  };

  const rzp = new window.Razorpay({
    key: keyId,
    order_id: result.razorpayOrderId!,
    amount: result.amount,
    currency: result.currency,
    name: LABELS.brandName,
    theme,
    method: getRazorpayCheckoutMethods(),
    config: getRazorpayCheckoutConfig(),
    // Lets Razorpay Checkout's own UI offer this shopper's saved cards/UPI
    // and the "save this instrument" toggle — Checkout-side behavior only.
    ...(result.razorpayCustomerId
      ? { customer_id: result.razorpayCustomerId }
      : {}),
    ...(result.checkoutConfigId ||
    process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_CONFIG_ID
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
        if (keepOrderOnDismiss) {
          showNotice({
            variant: "info",
            title: LABELS.paymentStillOpenTitle,
            description: LABELS.paymentStillOpenBody,
          });
          return;
        }
        const notice = lastFailure
          ? {
              variant: "danger" as const,
              title: LABELS.paymentFailedTitle,
              description: lastFailure,
            }
          : {
              variant: "info" as const,
              title: LABELS.paymentCancelledTitle,
              description: LABELS.paymentCancelledBody,
            };
        restoreCancelledCheckout(result.orderId, notice).catch(
          (err: unknown) => {
            // Paid after all (e.g. a UPI approval as the window closed): show the order.
            if (isApiErrorCode(err, ERROR_CODES.CHECKOUT_PAID_CANNOT_CANCEL)) {
              goToConfirmation();
            }
          },
        );
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
        onCheckoutComplete?.(result.orderId);
        onPhaseChange?.("redirecting");
        onOrderPlaced();
        navigate(router, PATHS.orderConfirmation(result.orderId));
      } catch (err) {
        onPhaseChange?.("idle");
        if (isApiErrorCode(err, ERROR_CODES.PAYMENT_AMOUNT_MISMATCH)) {
          showNotice({
            variant: "danger",
            title: LABELS.paymentFailedTitle,
            description: getApiErrorMessage(err, LABELS.paymentAmountMismatch),
          });
          return;
        }
        onCheckoutComplete?.(result.orderId);
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
    lastFailure = resp.error?.description || LABELS.paymentFailedBody;
  });

  rzp.open();
}
