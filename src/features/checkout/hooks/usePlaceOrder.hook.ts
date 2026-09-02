import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { useAuthStore } from "@/shared/stores/auth.store";
import {
  usePlaceOrder,
  useCheckoutQuote,
  checkoutKeys,
} from "../api/checkout.queries";
import { navigate } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";
import { ERROR_CODES } from "@/shared/constants/errors";
import { LABELS } from "@/shared/constants/labels";
import { ApiError } from "@/shared/types/apiError.types";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { cartKeys } from "@/features/cart";
import { usePaymentNotice, type PaymentNotice } from "./usePaymentNotice/index";
import { useRestoreCancelledCheckout } from "./useRestoreCancelledCheckout/index";
import { launchRazorpayPayment } from "./useRazorpayCheckout/index";
import { useCheckoutPaymentPhase } from "./useCheckoutPaymentPhase.hook";

export type { PaymentNotice };

const CART_EMPTY_MESSAGE = "Cart is empty";

function isCartEmptyError(err: unknown): boolean {
  return (
    err instanceof ApiError &&
    err.code === ERROR_CODES.VALIDATION_ERROR &&
    err.message === CART_EMPTY_MESSAGE
  );
}

export function usePlaceOrderWithRazorpay() {
  const {
    addressId,
    shippingMethodByVendor,
    appliedCouponCode,
    walletAmountToUse,
  } = useCheckoutStore();
  const placeOrder = usePlaceOrder();
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const { paymentNotice, showNotice, resetNotice, clearPaymentNotice } =
    usePaymentNotice();
  const { paymentPhase, setPaymentPhase, isPaymentOverlayOpen } =
    useCheckoutPaymentPhase();
  const pendingOrderIdRef = useRef<string | null>(null);

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

  const refetchCart = useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: cartKeys.all });
  }, [queryClient]);

  const invalidateCheckoutQuote = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: checkoutKeys.quote(quoteInput),
    });
  }, [queryClient, quoteInput]);

  const clearCartCache = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: cartKeys.all });
  }, [queryClient]);

  const clearPendingOrder = useCallback((orderId?: string) => {
    if (!orderId || pendingOrderIdRef.current === orderId) {
      pendingOrderIdRef.current = null;
    }
  }, []);

  const { restoreCancelledCheckout, awaitPendingRestores } =
    useRestoreCancelledCheckout({
      showNotice,
      refetchCart,
      onPhaseChange: setPaymentPhase,
      onRestoreComplete: (orderId) => {
        clearPendingOrder(orderId);
        invalidateCheckoutQuote();
      },
    });

  const recoverPendingCheckout = useCallback(
    async (options?: { silent?: boolean }) => {
      const orderId = pendingOrderIdRef.current;
      if (!orderId) return;
      await restoreCancelledCheckout(orderId, null, options);
    },
    [restoreCancelledCheckout],
  );

  const handlePlaceOrder = async (method: string) => {
    if (!addressId) return;
    resetNotice();
    await awaitPendingRestores();

    try {
      await recoverPendingCheckout({ silent: true });
    } catch {
      // Recovery failed; place order may still surface a clearer error.
    }

    setPaymentPhase("placing");

    try {
      // Wallet pays via points on a Razorpay checkout; BE has no WALLET enum.
      const apiPaymentMethod = method === "wallet" ? "razorpay" : method;
      const apiWalletAmount = method === "wallet" ? walletAmountToUse : 0;

      const result = await placeOrder.mutateAsync({
        addressId,
        paymentMethod: apiPaymentMethod,
        couponCode: appliedCouponCode || undefined,
        shippingMethodByVendor,
        walletAmountToUse: apiWalletAmount,
      });

      pendingOrderIdRef.current = result.orderId;

      if (apiPaymentMethod === "razorpay" && result.razorpayOrderId) {
        setPaymentPhase("idle");
        await launchRazorpayPayment(result, {
          router,
          showNotice,
          clearCartCache,
          restoreCancelledCheckout,
          onPhaseChange: setPaymentPhase,
          onCheckoutComplete: clearPendingOrder,
          prefill: {
            name: currentUser?.name,
            email: currentUser?.email,
            contact: currentUser?.phone ?? undefined,
          },
        });
        return;
      }

      clearPendingOrder(result.orderId);
      clearCartCache();
      navigate(router, PATHS.orderConfirmation(result.orderId));
    } catch (err) {
      setPaymentPhase("idle");

      if (isCartEmptyError(err) && pendingOrderIdRef.current) {
        try {
          await restoreCancelledCheckout(pendingOrderIdRef.current, {
            variant: "info",
            title: LABELS.cartEmptyCheckoutTitle,
            description: LABELS.cartEmptyCheckoutBody,
          });
        } catch {
          showNotice({
            variant: "danger",
            title: LABELS.placeOrderFailedTitle,
            description: LABELS.placeOrderFailedBody,
          });
        }
        return;
      }

      const isItemsUnavailable =
        err instanceof ApiError && err.code === ERROR_CODES.ITEMS_UNAVAILABLE;
      const description = isItemsUnavailable
        ? LABELS.removeUnavailableToCheckout
        : getApiErrorMessage(err, LABELS.placeOrderFailedBody);
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
    quoteErrorMessage: isQuoteError
      ? getApiErrorMessage(quoteError, LABELS.summaryLoadFailed)
      : undefined,
    isPending: placeOrder.isPending,
    paymentPhase,
    isPaymentOverlayOpen,
    paymentNotice,
    clearPaymentNotice,
  };
}
