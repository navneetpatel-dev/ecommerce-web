"use client";

import { useEffect, useState } from "react";
import {
  deliveryAdminApi,
  type AgentPayout,
} from "@/features/delivery-dashboard";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useReasonPrompt } from "@/shared/hooks/dialogs/useReasonPrompt.hook";

/** Owns the agent-payouts admin panel's data + batch/settle/fail/retry actions. */
export function useAgentPayoutsPanel() {
  const [payouts, setPayouts] = useState<AgentPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const failPrompt = useReasonPrompt();

  const load = () => {
    setLoading(true);
    deliveryAdminApi
      .payouts()
      .then(setPayouts)
      .catch(() => setPayouts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const download = async (payoutId: string) => {
    setDownloadingId(payoutId);
    try {
      await deliveryAdminApi.downloadPayoutStatement(payoutId);
    } finally {
      setDownloadingId(null);
    }
  };

  const process = async () => {
    setProcessing(true);
    setError(null);
    setMessage(null);
    try {
      const created = await deliveryAdminApi.processPayouts();
      setMessage(
        created.length > 0
          ? formatLabel(LABELS.payoutBatchesCreated, { count: created.length })
          : LABELS.noPendingEarnings,
      );
      load();
    } catch (processError) {
      setError(getApiErrorMessage(processError, LABELS.couldNotProcessPayouts));
    } finally {
      setProcessing(false);
    }
  };

  const requestFail = (payoutId: string) => {
    failPrompt.openFor(payoutId);
  };

  const runFail = async (payoutId: string, reason: string) => {
    setPendingId(payoutId);
    try {
      await deliveryAdminApi.markPayoutFailed(payoutId, reason);
      failPrompt.cancel();
      load();
    } catch (failError) {
      setError(getApiErrorMessage(failError, LABELS.couldNotMarkPayoutFailed));
    } finally {
      setPendingId(null);
    }
  };

  const confirmFail = () => {
    const payoutId = failPrompt.targetId;
    const reason = failPrompt.reason.trim();
    if (!payoutId || !reason) return;
    setError(null);
    void runFail(payoutId, reason);
  };

  const retry = async (payoutId: string) => {
    setPendingId(payoutId);
    setError(null);
    try {
      await deliveryAdminApi.retryPayout(payoutId);
      load();
    } catch (retryError) {
      setError(getApiErrorMessage(retryError, LABELS.couldNotRetryPayout));
    } finally {
      setPendingId(null);
    }
  };

  const pendingCount = payouts.filter((p) => p.status === "PENDING").length;

  return {
    payouts,
    loading,
    processing,
    pendingId,
    downloadingId,
    message,
    error,
    pendingCount,
    load,
    download,
    process,
    retry,
    requestFail,
    failReason: {
      open: failPrompt.open,
      pending: pendingId === failPrompt.targetId,
      reason: failPrompt.reason,
      onOpenChange: failPrompt.handleOpenChange,
      onReasonChange: failPrompt.handleReasonChange,
      onSubmit: confirmFail,
    },
  };
}
