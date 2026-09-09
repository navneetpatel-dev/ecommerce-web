import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { useAuthStore } from "@/shared/stores/auth.store";
import { usePlaceOrder } from "../api/checkout.queries";
import { useCart } from "@/features/cart";
import { resolveCheckoutCouponCodes } from "../utils/checkoutCouponCodes.utils";
import { buildPlaceOrderPayload } from "../utils/placeOrderPayload.utils";
import { usePaymentNotice, type PaymentNotice } from "./usePaymentNotice/index";
import { useRestoreCancelledCheckout } from "./useRestoreCancelledCheckout/index";
import { useCheckoutPaymentPhase } from "./useCheckoutPaymentPhase.hook";
import { useCheckoutQuoteState } from "./useCheckoutQuoteState.hook";
import { useOrderPlacementErrorHandler } from "./useOrderPlacementErrorHandler.hook";
import { usePendingOrderRecovery } from "./usePendingOrderRecovery.hook";
import { handleOrderPlacementSuccess } from "../utils/orderPlacementSuccess.utils";

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
  const couponCodes = resolveCheckoutCouponCodes(cart, appliedCouponCode);
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const { paymentNotice, showNotice, resetNotice, clearPaymentNotice } =
    usePaymentNotice();
  const { paymentPhase, setPaymentPhase, isPaymentOverlayOpen } =
    useCheckoutPaymentPhase();

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

  const { pendingOrderIdRef, clearPendingOrder, recoverPendingCheckout } =
    usePendingOrderRecovery(restoreCancelledCheckout);

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

      await handleOrderPlacementSuccess({
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
      });
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
