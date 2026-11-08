import { useEffect } from "react";
import { ApiError } from "@/shared/types/apiError.types";
import { useCheckoutQuote } from "../../api/checkout/checkout.queries";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { useCheckoutCacheActions } from "./useCheckoutCacheActions.hook";

interface UseCheckoutQuoteStateInput {
  addressId: string | null;
  shippingMethodByVendor: Record<string, string>;
  couponCodes: string[] | undefined;
  walletAmountToUse: number;
  giftWrap: boolean;
}

/** Fetches the live checkout quote and wires the cache-invalidation actions that key off it. */
export function useCheckoutQuoteState({
  addressId,
  shippingMethodByVendor,
  couponCodes,
  walletAmountToUse,
  giftWrap,
}: UseCheckoutQuoteStateInput) {
  const quoteInput = {
    addressId,
    shippingMethodByVendor,
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
  const { refetchCart } = cacheActions;

  // A coupon stopped working since the cart last loaded: reload it, which drops the code
  // from the next quote and shows why on the page, instead of leaving checkout stuck.
  const quoteCouponError =
    quoteError instanceof ApiError && quoteError.code?.startsWith("COUPON_");
  useEffect(() => {
    if (quoteCouponError) void refetchCart();
  }, [quoteCouponError, refetchCart]);

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
