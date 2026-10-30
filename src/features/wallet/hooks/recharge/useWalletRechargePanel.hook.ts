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
  const [presetError, setPresetError] = useState<string | null>(null);

  const limits = balance?.limits;
  const presets = useMemo(() => {
    const offered = limits?.presetsInr ?? [];
    if (!limits) return offered;
    return offered.filter(
      (amount) => amount >= limits.minInr && amount <= limits.maxInr,
    );
  }, [limits]);
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
      setPresetError(null);
      const preview = await walletApi.previewRecharge(amount);
      const message = walletRechargeValidationLabel(
        preview.validationCode,
        limits,
      );
      if (message) {
        setPresetError(message);
        return;
      }
      await recharge(amount);
    },
    [clearMessages, limits, recharge],
  );

  const onCustomAmountChange = (value: number | undefined) => {
    setCustomAmount(value);
    setPresetError(null);
    clearMessages();
  };

  const submitCustomAmount = () => {
    if (customAmount) void startRecharge(customAmount);
  };

  return {
    isBusy,
    error: presetError ?? error,
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
