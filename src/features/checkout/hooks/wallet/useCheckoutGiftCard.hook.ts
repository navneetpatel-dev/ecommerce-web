"use client";

import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { CheckoutQuote } from "@/shared/api/types";
import { giftCardsApi } from "@/features/giftCards";
import { walletKeys } from "@/features/wallet";
import { LABELS } from "@/shared/constants/labels";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

/** Every checkout quote, whatever its input; the server re-reads the wallet on refetch. */
const CHECKOUT_QUOTES_KEY = ["checkout", "quote"] as const;

/**
 * The server's wallet cap from the quote checkout is showing, read from the
 * cache right after the refetch (the parent's props lag a render behind).
 */
function latestWalletCap(queryClient: QueryClient): number {
  const [latest] = queryClient
    .getQueryCache()
    .findAll({ queryKey: CHECKOUT_QUOTES_KEY, type: "active" })
    .sort((a, b) => b.state.dataUpdatedAt - a.state.dataUpdatedAt);
  return (
    (latest?.state.data as CheckoutQuote | undefined)?.maxWalletApplicable ?? 0
  );
}

interface UseCheckoutGiftCardParams {
  onSelect: (method: string) => void;
  onWalletAmountChange: (amount: number) => void;
}

/**
 * Pays with a gift card: the card is redeemed into the wallet, the quote is
 * fetched again, and the wallet is applied up to the server's new cap. Any
 * value the order does not use stays in the wallet.
 */
export function useCheckoutGiftCard({
  onSelect,
  onWalletAmountChange,
}: UseCheckoutGiftCardParams) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCode(event.target.value);
      setError(null);
    },
    [],
  );

  const handleApply = useCallback(async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setPending(true);
    setError(null);
    try {
      const redeemed = await giftCardsApi.redeem(trimmed);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: walletKeys.all }),
        queryClient.invalidateQueries({ queryKey: CHECKOUT_QUOTES_KEY }),
      ]);
      setCode("");
      const cap = latestWalletCap(queryClient);
      if (cap > 0) {
        onSelect("wallet");
        onWalletAmountChange(cap);
      }
      notifySuccess(
        formatLabel(LABELS.checkoutGiftCardApplied, {
          code: redeemed.code,
          amount: formatInr(redeemed.amount),
        }),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.checkoutGiftCardFailed));
    } finally {
      setPending(false);
    }
  }, [code, queryClient, onSelect, onWalletAmountChange]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void handleApply();
    },
    [handleApply],
  );

  return {
    code,
    pending,
    error,
    canApply: code.trim().length > 0 && !pending,
    handleCodeChange,
    handleSubmit,
  };
}
