"use client";

import { useEffect, useState } from "react";
import {
  deliveryAdminApi,
  type CashDeposit,
} from "@/features/delivery-dashboard";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { useReasonPrompt } from "@/shared/hooks/dialogs/useReasonPrompt.hook";

/** Owns the admin cash-deposits reconciliation panel's data + verify/reject actions. */
export function useCashDepositsPanel() {
  const [deposits, setDeposits] = useState<CashDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rejectPrompt = useReasonPrompt();

  const load = () => {
    deliveryAdminApi
      .cashDeposits()
      .then(setDeposits)
      .catch(() => setDeposits([]))
      .finally(() => setLoading(false));
  };

  const reload = () => {
    setLoading(true);
    load();
  };

  useEffect(load, []);

  const verify = async (depositId: string) => {
    setError(null);
    setPendingId(depositId);
    try {
      await deliveryAdminApi.verifyCashDeposit(depositId, "VERIFY");
      reload();
    } catch (actionError) {
      setError(getApiErrorMessage(actionError, LABELS.couldNotUpdateDeposit));
    } finally {
      setPendingId(null);
    }
  };

  const runReject = async (depositId: string, reason: string) => {
    setPendingId(depositId);
    try {
      await deliveryAdminApi.verifyCashDeposit(depositId, "REJECT", reason);
      rejectPrompt.cancel();
      reload();
    } catch (actionError) {
      setError(getApiErrorMessage(actionError, LABELS.couldNotUpdateDeposit));
    } finally {
      setPendingId(null);
    }
  };

  const confirmReject = () => {
    const depositId = rejectPrompt.targetId;
    const reason = rejectPrompt.reason.trim();
    if (!depositId || !reason) return;
    setError(null);
    void runReject(depositId, reason);
  };

  const pending = deposits.filter((d) => d.status === "PENDING");

  return {
    deposits,
    loading,
    pendingId,
    error,
    verify,
    pending,
    rejectReason: {
      open: rejectPrompt.open,
      pending: pendingId === rejectPrompt.targetId,
      reason: rejectPrompt.reason,
      onOpenChange: rejectPrompt.handleOpenChange,
      onReasonChange: rejectPrompt.handleReasonChange,
      onSubmit: confirmReject,
      request: rejectPrompt.openFor,
    },
  };
}
