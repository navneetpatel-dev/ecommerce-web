"use client";

import { useCallback, useMemo, useState } from "react";
import { walletApi } from "../../api/wallet/wallet.api";
import type { WalletBalanceResponse } from "../../api/wallet/wallet.api";
import { useWalletRecharge } from "./useWalletRecharge.hook";
import { useWalletRechargePreview } from "./useWalletRechargePreview.hook";
import { walletRechargeValidationLabel } from "../../utils/recharge/walletRechargeValidation";

export function useWalletRechargePanel(
  balance: WalletBalanceResponse | undefined,
) {
  const { recharge, isBusy, error, successMessage, clearMessages } =
    useWalletRecharge();
  const [customAmount, setCustomAmount] = useState<number | undefined>();

  const limits = balance?.limits;
  const presets = limits?.presetsInr ?? [];
  const rechargeEnabled = balance?.rechargeEnabled !== false;

  const customPreviewQuery = useWalletRechargePreview(customAmount);

  const customValidationCode = customPreviewQuery.data?.validationCode ?? null;

  const amountError = useMemo(
    () => walletRechargeValidationLabel(customValidationCode, limits),
    [customValidationCode, limits],
  );

  const canSubmitCustomAmount =
    customAmount != null &&
    customAmount > 0 &&
    customValidationCode === "ok" &&
    !customPreviewQuery.isFetching;

  const startRecharge = useCallback(
    async (amount: number) => {
      clearMessages();
      const preview = await walletApi.previewRecharge(amount);
      const message = walletRechargeValidationLabel(
        preview.validationCode,
        limits,
      );
      if (message) return;
      await recharge(amount);
    },
    [clearMessages, limits, recharge],
  );

  const onCustomAmountChange = (value: number | undefined) => {
    setCustomAmount(value);
    clearMessages();
  };

  const submitCustomAmount = () => {
    if (customAmount) void startRecharge(customAmount);
  };

  return {
    isBusy,
    error,
    successMessage,
    limits,
    presets,
    rechargeEnabled,
    customAmount,
    customPreviewQuery,
    amountError,
    canSubmitCustomAmount,
    startRecharge,
    onCustomAmountChange,
    submitCustomAmount,
  };
}
