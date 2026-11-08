import { LABELS } from "@/shared/constants/labels";
import type { PaymentNotice } from "../../hooks/payment/usePaymentNotice/index";
import type {
  LaunchRazorpayPaymentHelpers,
  PlaceOrderResult,
} from "../../hooks/payment/useRazorpayCheckout/types";

/**
 * The per-order extras for Razorpay Checkout: the shopper's Razorpay customer
 * (so Checkout's own UI offers their saved cards/UPI and the "save" toggle),
 * the checkout config, and the contact prefill.
 */
export function razorpayOrderExtras(
  result: PlaceOrderResult,
  prefill: LaunchRazorpayPaymentHelpers["prefill"],
): Record<string, unknown> {
  const checkoutConfigId =
    result.checkoutConfigId ||
    process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_CONFIG_ID;
  return {
    ...(result.razorpayCustomerId
      ? { customer_id: result.razorpayCustomerId }
      : {}),
    ...(checkoutConfigId ? { checkout_config_id: checkoutConfigId } : {}),
    ...(prefill ? { prefill } : {}),
  };
}

/** What to tell the shopper when they close the window: the last failure, or a plain cancel. */
export function razorpayDismissNotice(
  lastFailure: string | null,
): PaymentNotice {
  return lastFailure
    ? {
        variant: "danger",
        title: LABELS.paymentFailedTitle,
        description: lastFailure,
      }
    : {
        variant: "info",
        title: LABELS.paymentCancelledTitle,
        description: LABELS.paymentCancelledBody,
      };
}
