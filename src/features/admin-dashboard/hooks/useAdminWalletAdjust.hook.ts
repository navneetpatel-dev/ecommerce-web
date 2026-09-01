"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatPoints } from "@/shared/utils/formatPoints";
import { useManualFormFieldErrors } from "@/shared/hooks/useManualFormFieldErrors.hook";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "@/shared/utils/applyApiFormErrors";
import { walletAdminApi } from "../api/walletAdmin.api";

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

  return {
    userId,
    setUserId,
    direction,
    setDirection,
    amount,
    setAmount,
    reason,
    setReason,
    pointSource,
    setPointSource,
    loading,
    error,
    fieldError: getError,
    message,
    submit,
  };
}
