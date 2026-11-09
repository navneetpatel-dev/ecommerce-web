import { useCheckoutQuote } from "../../api/checkout/checkout.queries";
import { useCheckoutStore } from "../../store/checkout.store";
import { toApiPaymentMethod } from "../../utils/checkout/placeOrderPayload.utils";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { useCheckoutCacheActions } from "./useCheckoutCacheActions.hook";

interface UseCheckoutQuoteStateInput {
  addressId: string | null;
  shippingMethodByVendor: Record<string, string>;
  appliedCouponCode: string | null;
  couponCodes: string[] | undefined;
  walletAmountToUse: number;
  giftWrap: boolean;
}

/** Fetches the live checkout quote and wires the cache-invalidation actions that key off it. */
export function useCheckoutQuoteState({
  addressId,
  shippingMethodByVendor,
  appliedCouponCode,
  couponCodes,
  walletAmountToUse,
  giftWrap,
}: UseCheckoutQuoteStateInput) {
  // Sent so cashback offers limited to a payment method show once one is picked.
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const quoteInput = {
    addressId,
    shippingMethodByVendor,
    couponCode: appliedCouponCode,
    couponCodes,
    walletAmountToUse,
    giftWrap,
    paymentMethod: paymentMethod
      ? toApiPaymentMethod(paymentMethod)
      : undefined,
  };
  const {
    data: quote,
    isLoading: isQuoteLoading,
    isError: isQuoteError,
    error: quoteError,
  } = useCheckoutQuote(quoteInput);

  const cacheActions = useCheckoutCacheActions(quoteInput);

  return {
    quote,
    isQuoteLoading,
    isQuoteError,
    quoteErrorMessage: isQuoteError
      ? getApiErrorMessage(quoteError, LABELS.summaryLoadFailed)
      : undefined,
    ...cacheActions,
  };
}
