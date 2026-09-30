import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/features/checkout/store/checkout.store";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { usePlaceOrder } from "../../api/checkout/checkout.queries";
import { useCart } from "@/features/cart";
import { resolveCheckoutCouponCodes } from "../../utils/checkout/checkoutCouponCodes.utils";
import { buildPlaceOrderPayload } from "../../utils/checkout/placeOrderPayload.utils";
import {
  usePaymentNotice,
  type PaymentNotice,
} from "../payment/usePaymentNotice/index";
import { useRestoreCancelledCheckout } from "./useRestoreCancelledCheckout/index";
import { useResetCheckoutOnOrderPlaced } from "./useCheckoutSession.hook";
import { useCheckoutPaymentPhase } from "../payment/useCheckoutPaymentPhase.hook";
import { useCheckoutQuoteState } from "./useCheckoutQuoteState.hook";
import { useOrderPlacementErrorHandler } from "./useOrderPlacementErrorHandler.hook";
import { usePendingOrderRecovery } from "./usePendingOrderRecovery.hook";
import { handleOrderPlacementSuccess } from "../../utils/checkout/orderPlacementSuccess.utils";

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

  // Both success paths call this (cash/COD immediately, Razorpay after verification), and
  // the cancelled/failed ones deliberately don't: ending the flow here is what stops the
  // next purchase from resuming this one.
  const handleOrderPlaced = useResetCheckoutOnOrderPlaced(onOrderPlaced);

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
        onOrderPlaced: handleOrderPlaced,
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
