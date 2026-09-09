import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { useAuthStore } from "@/shared/stores/auth.store";
import { usePlaceOrder } from "../api/checkout.queries";
import { navigate } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";
import { useCart } from "@/features/cart";
import { resolveCheckoutCouponCodes } from "../utils/checkoutCouponCodes.utils";
import { buildPlaceOrderPayload } from "../utils/placeOrderPayload.utils";
import { usePaymentNotice, type PaymentNotice } from "./usePaymentNotice/index";
import { useRestoreCancelledCheckout } from "./useRestoreCancelledCheckout/index";
import { launchRazorpayPayment } from "./useRazorpayCheckout/index";
import { useCheckoutPaymentPhase } from "./useCheckoutPaymentPhase.hook";
import { useCheckoutQuoteState } from "./useCheckoutQuoteState.hook";
import { useOrderPlacementErrorHandler } from "./useOrderPlacementErrorHandler.hook";

export type { PaymentNotice };

export function usePlaceOrderWithRazorpay() {
  const {
    addressId,
    shippingMethodByVendor,
    appliedCouponCode,
    walletAmountToUse,
    giftWrap,
    giftMessage,
  } = useCheckoutStore();
  const placeOrder = usePlaceOrder();
  const { data: cart } = useCart();
  // Stacked codes on the cart — falls back to the single manually-typed code.
  const couponCodes = resolveCheckoutCouponCodes(cart, appliedCouponCode);
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const { paymentNotice, showNotice, resetNotice, clearPaymentNotice } =
    usePaymentNotice();
  const { paymentPhase, setPaymentPhase, isPaymentOverlayOpen } =
    useCheckoutPaymentPhase();
  const pendingOrderIdRef = useRef<string | null>(null);

  const {
    quote,
    isQuoteLoading,
    isQuoteError,
    quoteErrorMessage,
    refetchCart,
    invalidateCheckoutQuote,
    clearCartCache,
    onOrderPlaced,
    invalidateWalletCache,
  } = useCheckoutQuoteState({
    addressId,
    shippingMethodByVendor,
    appliedCouponCode,
    couponCodes,
    walletAmountToUse,
    giftWrap,
  });

  const clearPendingOrder = useCallback((orderId?: string) => {
    if (!orderId || pendingOrderIdRef.current === orderId) {
      pendingOrderIdRef.current = null;
    }
  }, []);

  const { restoreCancelledCheckout, awaitPendingRestores } =
    useRestoreCancelledCheckout({
      showNotice,
      refetchCart,
      invalidateWalletCache,
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

  const handlePlaceOrderError = useOrderPlacementErrorHandler({
    showNotice,
    restoreCancelledCheckout,
    clearCartCache,
  });

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
      const { apiPaymentMethod, apiWalletAmount, payload } =
        buildPlaceOrderPayload({
          method,
          addressId,
          appliedCouponCode,
          couponCodes,
          shippingMethodByVendor,
          walletAmountToUse,
          giftWrap,
          giftMessage,
        });

      const result = await placeOrder.mutateAsync(payload);

      pendingOrderIdRef.current = result.orderId;

      if (apiWalletAmount > 0) {
        invalidateWalletCache();
      }

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
            name: currentUser?.name,
            email: currentUser?.email,
            contact: currentUser?.phone ?? undefined,
          },
        });
        return;
      }

      clearPendingOrder(result.orderId);
      setPaymentPhase("redirecting");
      onOrderPlaced();
      navigate(router, PATHS.orderConfirmation(result.orderId));
    } catch (err) {
      setPaymentPhase("idle");
      await handlePlaceOrderError(err, pendingOrderIdRef.current);
    }
  };

  return {
    handlePlaceOrder,
    quote,
    isQuoteLoading,
    isQuoteError,
    quoteErrorMessage,
    isPending: placeOrder.isPending,
    paymentPhase,
    isPaymentOverlayOpen,
    paymentNotice,
    clearPaymentNotice,
  };
}
