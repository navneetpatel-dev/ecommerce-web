import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { usePlaceOrder, useCheckoutQuote } from "../api/checkout.queries";
import { checkoutApi } from "../api/checkout.api";
import { loadRazorpayScript } from "../utils/loadRazorpayScript";
import { navigate } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";
import { ERROR_CODES } from "@/shared/constants/errors";
import { LABELS } from "@/shared/constants/labels";
import { ApiError } from "@/shared/api/client";
import { cartKeys } from "@/features/cart";
import type { StatusDialogVariant } from "@/shared/components/StatusDialog";

export type PaymentNotice = {
  variant: StatusDialogVariant;
  title: string;
  description: string;
};

export function usePlaceOrderWithRazorpay() {
  const {
    addressId,
    shippingMethodByVendor,
    appliedCouponCode,
    walletAmountToUse,
  } = useCheckoutStore();
  const placeOrder = usePlaceOrder();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [paymentNotice, setPaymentNotice] = useState<PaymentNotice | null>(
    null,
  );
  const cancelInFlightRef = useRef<Set<string>>(new Set());

  const quoteInput = {
    addressId,
    shippingMethodByVendor,
    couponCode: appliedCouponCode,
    walletAmountToUse,
  };
  const { data: quote } = useCheckoutQuote(quoteInput);

  const clearCartCache = () => {
    void queryClient.invalidateQueries({ queryKey: cartKeys.all });
  };

  const showNotice = (notice: PaymentNotice) => {
    setPaymentNotice(notice);
  };

  const restoreCancelledCheckout = async (
    orderId: string,
    notice: PaymentNotice,
  ) => {
    if (cancelInFlightRef.current.has(orderId)) return;
    cancelInFlightRef.current.add(orderId);

    try {
      await checkoutApi.cancelCheckout({ orderId });
      clearCartCache();
      showNotice(notice);
    } catch (err) {
      const description =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : notice.description;
      showNotice({
        variant: "danger",
        title: notice.title,
        description,
      });
      clearCartCache();
    }
  };

  const handlePlaceOrder = async (method: string) => {
    if (!addressId) return;
    setPaymentNotice(null);

    try {
      const result = await placeOrder.mutateAsync({
        addressId,
        paymentMethod: method,
        couponCode: appliedCouponCode || undefined,
        shippingMethodByVendor,
        walletAmountToUse: method === "cod" ? 0 : walletAmountToUse,
      });

      const skipRazorpay =
        method === "razorpay" &&
        (!result.razorpayOrderId || (quote?.amountDue ?? 0) <= 0);

      if (method === "razorpay" && result.razorpayOrderId && !skipRazorpay) {
        await loadRazorpayScript();
        if (!window.Razorpay) {
          showNotice({
            variant: "danger",
            title: LABELS.paymentUnavailableTitle,
            description: LABELS.paymentUnavailableLoadScript,
          });
          return;
        }

        const keyId =
          result.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
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
          order_id: result.razorpayOrderId,
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
        return;
      }

      clearCartCache();
      navigate(router, PATHS.orderConfirmation(result.orderId));
    } catch (err) {
      const isItemsUnavailable =
        err instanceof ApiError && err.code === ERROR_CODES.ITEMS_UNAVAILABLE;
      const description = isItemsUnavailable
        ? LABELS.removeUnavailableToCheckout
        : err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : LABELS.placeOrderFailedBody;
      showNotice({
        variant: isItemsUnavailable ? "warning" : "danger",
        title: isItemsUnavailable
          ? LABELS.itemsUnavailableTitle
          : LABELS.placeOrderFailedTitle,
        description,
      });
      if (isItemsUnavailable) {
        clearCartCache();
      }
    }
  };

  return {
    handlePlaceOrder,
    quote,
    isPending: placeOrder.isPending,
    paymentNotice,
    clearPaymentNotice: () => setPaymentNotice(null),
  };
}
