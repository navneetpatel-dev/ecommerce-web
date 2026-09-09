"use client";

import { useMemo, useCallback } from "react";
import type { CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface UsePaymentStepParams {
  isPending: boolean;
  selectedMethod?: string | null;
  quote?: CheckoutQuote | null;
  walletAmountToUse: number;
  onSelect: (method: string) => void;
  onWalletAmountChange: (amount: number) => void;
}

export function usePaymentStep({
  isPending,
  selectedMethod,
  quote,
  walletAmountToUse,
  onSelect,
  onWalletAmountChange,
}: UsePaymentStepParams) {
  const walletBalance = quote?.walletBalance ?? 0;
  const amountDue = quote?.amountDue;
  const maxApplicable = quote?.maxWalletApplicable ?? 0;
  const walletSelected = selectedMethod === "wallet";
  const canUseCod = quote?.codAvailable === true;
  const canUseWallet = Boolean(quote) && walletBalance > 0 && maxApplicable > 0;
  const walletReady = walletSelected && walletAmountToUse > 0;

  const canContinue =
    Boolean(selectedMethod) &&
    (selectedMethod !== "cod" || canUseCod) &&
    (selectedMethod !== "wallet" || walletReady);

  const continueHint = useMemo(() => {
    if (!selectedMethod) return LABELS.selectPaymentMethodToContinue;
    if (selectedMethod === "wallet" && !walletReady) {
      return LABELS.selectWalletAmountToContinue;
    }
    return LABELS.selectPaymentMethodToContinue;
  }, [selectedMethod, walletReady]);

  const handleSelectMethod = useCallback(
    (methodId: string) => {
      onSelect(methodId);
      if (methodId === "wallet") {
        onWalletAmountChange(maxApplicable);
      } else {
        onWalletAmountChange(0);
      }
    },
    [onSelect, onWalletAmountChange, maxApplicable],
  );

  const remainderDueText = useMemo(() => {
    if (walletAmountToUse > 0 && amountDue != null && amountDue > 0) {
      return formatLabel(LABELS.paymentMethodWalletRemainderDue, {
        amount: `₹${formatInrAmount(amountDue)}`,
      });
    }
    return null;
  }, [walletAmountToUse, amountDue]);

  return {
    walletBalance,
    amountDue,
    maxApplicable,
    walletSelected,
    canUseCod,
    canUseWallet,
    canContinue,
    continueHint,
    handleSelectMethod,
    remainderDueText,
    isWalletDisabled: isPending || !canUseWallet,
    isCodDisabled: isPending || !canUseCod,
  };
}
