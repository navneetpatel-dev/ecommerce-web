"use client";

import { useCallback, type ChangeEvent } from "react";
import type { CheckoutQuote } from "@/shared/api/types";

interface UseReviewStepParams {
  quote: CheckoutQuote | null;
  hasUnavailableItems?: boolean;
  onGiftWrapChange?: (giftWrap: boolean) => void;
  onGiftMessageChange?: (giftMessage: string) => void;
}

export function useReviewStep({
  quote,
  hasUnavailableItems,
  onGiftWrapChange,
  onGiftMessageChange,
}: UseReviewStepParams) {
  const payable = quote?.amountDue ?? 0;
  const showsUnavailableWarning = Boolean(hasUnavailableItems);

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
    handleGiftWrapCheckedChange,
    handleGiftMessageChange,
  };
}
