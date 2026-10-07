"use client";

import { useState, type ChangeEvent } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { useManualFormFieldErrors } from "@/shared/hooks/forms/useManualFormFieldErrors.hook";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import { walletAdminApi } from "../../api/wallet/walletAdmin.api";

type WalletAdjustField = "userId" | "amount" | "reason";

export function useAdminWalletAdjust() {
  const [userId, setUserId] = useState("");
  const [direction, setDirection] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [amount, setAmount] = useState<number | undefined>();
  const [reason, setReason] = useState("");
  const [pointSource, setPointSource] = useState<"PURCHASED" | "PROMOTIONAL">(
    "PROMOTIONAL",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { clearAll, setErrors, getError } =
    useManualFormFieldErrors<WalletAdjustField>();

  const submit = async () => {
    if (!userId.trim() || !amount || amount <= 0 || reason.trim().length < 3) {
      setError(LABELS.walletAdjustValidationError);
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    clearAll();
    try {
      const result = await walletAdminApi.adjust(userId.trim(), {
        direction,
        amount,
        reason: reason.trim(),
        ...(direction === "CREDIT" ? { pointSource } : {}),
      });
      setMessage(
        formatLabel(LABELS.walletAdjustSuccess, {
          balance: formatPoints(result.balance),
        }),
      );
      setAmount(undefined);
      setReason("");
    } catch (err) {
      const mapped = applyApiErrorsToManualForm<WalletAdjustField>(
        err,
        setErrors,
      );
      setError(
        mapped ? null : getFormLevelApiError(err, LABELS.walletAdjustFailed),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const handleDirectionChange = (value: string) => {
    setDirection(value as "CREDIT" | "DEBIT");
  };

  const handlePointSourceChange = (value: string) => {
    setPointSource(value as "PURCHASED" | "PROMOTIONAL");
  };

  const handleReasonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
  };

  const handleSubmit = () => {
    void submit();
  };

  return {
    userId,
    setUserId,
    handleUserIdChange,
    direction,
    setDirection,
    handleDirectionChange,
    amount,
    setAmount,
    reason,
    setReason,
    handleReasonChange,
    pointSource,
    setPointSource,
    handlePointSourceChange,
    loading,
    error,
    fieldError: getError,
    message,
    submit,
    handleSubmit,
  };
}
