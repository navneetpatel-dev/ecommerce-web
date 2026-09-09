import { useCheckoutQuote } from "../api/checkout.queries";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
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
  const quoteInput = {
    addressId,
    shippingMethodByVendor,
    couponCode: appliedCouponCode,
    couponCodes,
    walletAmountToUse,
    giftWrap,
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
