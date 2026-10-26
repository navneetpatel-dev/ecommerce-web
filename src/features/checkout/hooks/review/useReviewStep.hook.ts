"use client";

import { useCallback, type ChangeEvent } from "react";
import type { CheckoutQuote } from "@/shared/api/types";

interface UseReviewStepParams {
  quote: CheckoutQuote | null;
  isQuoteLoading?: boolean;
  isQuoteError?: boolean;
  hasUnavailableItems?: boolean;
  onGiftWrapChange?: (giftWrap: boolean) => void;
  onGiftMessageChange?: (giftMessage: string) => void;
}

export function useReviewStep({
  quote,
  isQuoteLoading,
  isQuoteError,
  hasUnavailableItems,
  onGiftWrapChange,
  onGiftMessageChange,
}: UseReviewStepParams) {
  const payable = quote?.amountDue ?? 0;
  const showsUnavailableWarning = Boolean(hasUnavailableItems);
  // The order goes through only at a total on screen: not while it reprices or failed.
  const placeOrderDisabled =
    showsUnavailableWarning ||
    !quote ||
    Boolean(isQuoteLoading) ||
    Boolean(isQuoteError);

  const handleGiftWrapCheckedChange = useCallback(
    (checked: boolean) => {
      onGiftWrapChange?.(checked);
    },
    [onGiftWrapChange],
  );

  const handleGiftMessageChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onGiftMessageChange?.(e.target.value);
    },
    [onGiftMessageChange],
  );

  return {
    payable,
    showsUnavailableWarning,
    placeOrderDisabled,
    handleGiftWrapCheckedChange,
    handleGiftMessageChange,
  };
}
