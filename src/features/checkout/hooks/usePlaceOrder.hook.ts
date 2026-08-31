import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { usePlaceOrder, useCheckoutQuote } from "../api/checkout.queries";
import { navigate } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";
import { ERROR_CODES } from "@/shared/constants/errors";
import { LABELS } from "@/shared/constants/labels";
import { ApiError } from "@/shared/types/apiError.types";
import { cartKeys } from "@/features/cart";
import { usePaymentNotice, type PaymentNotice } from "./usePaymentNotice/index";
import { useRestoreCancelledCheckout } from "./useRestoreCancelledCheckout/index";
import { launchRazorpayPayment } from "./useRazorpayCheckout/index";
import { useCheckoutPaymentPhase } from "./useCheckoutPaymentPhase.hook";

export type { PaymentNotice };

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
  const { paymentNotice, showNotice, resetNotice, clearPaymentNotice } =
    usePaymentNotice();
  const { paymentPhase, setPaymentPhase, isPaymentOverlayOpen } =
    useCheckoutPaymentPhase();

  const quoteInput = {
    addressId,
    shippingMethodByVendor,
    couponCode: appliedCouponCode,
    walletAmountToUse,
  };
  const {
    data: quote,
    isLoading: isQuoteLoading,
    isError: isQuoteError,
    error: quoteError,
  } = useCheckoutQuote(quoteInput);

  const clearCartCache = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: cartKeys.all });
  }, [queryClient]);

  const restoreCancelledCheckout = useRestoreCancelledCheckout({
    showNotice,
    clearCartCache,
  });

  const handlePlaceOrder = async (method: string) => {
    if (!addressId) return;
    resetNotice();
    setPaymentPhase("placing");

    try {
      const result = await placeOrder.mutateAsync({
        addressId,
        paymentMethod: method,
        couponCode: appliedCouponCode || undefined,
        shippingMethodByVendor,
        walletAmountToUse: method === "cod" ? 0 : walletAmountToUse,
      });

      if (
        method === "razorpay" &&
        result.razorpayOrderId &&
        (quote?.amountDue ?? 0) > 0
      ) {
        setPaymentPhase("idle");
        await launchRazorpayPayment(result, {
          router,
          showNotice,
          clearCartCache,
          restoreCancelledCheckout,
          onPhaseChange: setPaymentPhase,
        });
        return;
      }

      clearCartCache();
      navigate(router, PATHS.orderConfirmation(result.orderId));
    } catch (err) {
      setPaymentPhase("idle");
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
    isQuoteLoading,
    isQuoteError,
    quoteErrorMessage:
      quoteError instanceof ApiError
        ? quoteError.message
        : isQuoteError
          ? LABELS.summaryLoadFailed
          : undefined,
    isPending: placeOrder.isPending,
    paymentPhase,
    isPaymentOverlayOpen,
    paymentNotice,
    clearPaymentNotice,
  };
}
