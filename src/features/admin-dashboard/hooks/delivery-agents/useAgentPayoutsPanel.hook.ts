"use client";

import { useEffect, useState } from "react";
import {
  deliveryAdminApi,
  type AgentPayout,
} from "@/features/delivery-dashboard";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

/** Owns the agent-payouts admin panel's data + batch/settle/fail/retry actions. */
export function useAgentPayoutsPanel() {
  const [payouts, setPayouts] = useState<AgentPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          ? `${created.length} payout batch(es) created from settled earnings.`
          : "No pending earnings to process.",
      );
      load();
    } catch (processError) {
      setError(
        getApiErrorMessage(processError, "Could not process agent payouts."),
      );
    } finally {
      setProcessing(false);
    }
  };

  const fail = async (payoutId: string) => {
    const reason = window.prompt("Reason this payout failed?");
    if (!reason) return;
    setPendingId(payoutId);
    setError(null);
    try {
      await deliveryAdminApi.markPayoutFailed(payoutId, reason);
      load();
    } catch (failError) {
      setError(
        getApiErrorMessage(failError, "Could not mark this payout failed."),
      );
    } finally {
      setPendingId(null);
    }
  };

  const retry = async (payoutId: string) => {
    setPendingId(payoutId);
    setError(null);
    try {
      await deliveryAdminApi.retryPayout(payoutId);
      load();
    } catch (retryError) {
      setError(getApiErrorMessage(retryError, "Could not retry this payout."));
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
    fail,
    retry,
  };
}
