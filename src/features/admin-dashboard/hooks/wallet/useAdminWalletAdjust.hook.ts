"use client";

import { useCallback, useState, type ChangeEvent } from "react";
import type {
  InfiniteSingleSelectPageQuery,
  InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { useManualFormFieldErrors } from "@/shared/hooks/forms/useManualFormFieldErrors.hook";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import { walletAdminApi } from "../../api/wallet/walletAdmin.api";
import {
  EMPTY_WALLET_USER_PAGE,
  WALLET_USER_SEARCH_MIN,
  walletUsersToPage,
} from "../../utils/wallet/walletUserOptions";

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

  const handleUserChange = (id: string) => {
    setUserId(id);
  };

  // No request until there is enough to search for: the API refuses shorter terms.
  const fetchUsers = useCallback(
    async (
      query: InfiniteSingleSelectPageQuery,
    ): Promise<InfiniteSingleSelectPageResult> => {
      const term = query.search?.trim() ?? "";
      if (term.length < WALLET_USER_SEARCH_MIN) return EMPTY_WALLET_USER_PAGE;
      return walletUsersToPage(await walletAdminApi.searchUsers(term));
    },
    [],
  );

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
    handleUserChange,
    fetchUsers,
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
