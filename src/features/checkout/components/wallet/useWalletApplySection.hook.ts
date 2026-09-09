"use client";

import { useMemo, useCallback } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";

interface UseWalletApplySectionParams {
  walletBalance: number;
  maxApplicable: number;
  walletAmountToUse: number;
  amountDue?: number;
  onAmountChange: (amount: number) => void;
}

export function useWalletApplySection({
  walletBalance,
  maxApplicable,
  walletAmountToUse,
  amountDue,
  onAmountChange,
}: UseWalletApplySectionParams) {
  const formattedPoints = useMemo(() => {
    return formatPoints(walletBalance);
  }, [walletBalance]);

  const remainderHint = useMemo(() => {
    return formatLabel(LABELS.walletRemainderDue, {
      amount:
        amountDue != null ? `₹${formatInrAmount(amountDue)}` : "Updating…",
    });
  }, [amountDue]);

  const handleUseAll = useCallback(() => {
    onAmountChange(maxApplicable);
  }, [onAmountChange, maxApplicable]);

  const handleNumberChange = useCallback(
    (value?: number) => {
      onAmountChange(value ?? 0);
    },
    [onAmountChange],
  );

  const showFullyCovers =
    amountDue != null && amountDue <= 0 && walletAmountToUse > 0;

  return {
    formattedPoints,
    remainderHint,
    handleUseAll,
    handleNumberChange,
    showFullyCovers,
  };
}
