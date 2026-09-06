"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { walletKeys } from "@/features/wallet";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { giftCardsApi, type GiftCardRedeemResult } from "../api/giftCards.api";

export function useGiftCardRedeem() {
  const queryClient = useQueryClient();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GiftCardRedeemResult | null>(null);

  const redeem = useCallback(
    async (code: string) => {
      setError(null);
      setIsRedeeming(true);
      try {
        const redeemed = await giftCardsApi.redeem(code);
        setResult(redeemed);
        await queryClient.invalidateQueries({ queryKey: walletKeys.all });
      } catch (err) {
        setError(
          getApiErrorMessage(
            err,
            "Could not redeem this gift card. Please try again.",
          ),
        );
      } finally {
        setIsRedeeming(false);
      }
    },
    [queryClient],
  );

  return { redeem, isRedeeming, error, result };
}
