"use client";

import { useEffect, useState } from "react";
import { Download, PlayCircle, RotateCw, Wallet, XCircle } from "lucide-react";
import {
  deliveryAdminApi,
  type AgentPayout,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { AgentMarkPayoutPaidAction } from "./AgentMarkPayoutPaidAction.component";

/** Admin batch-processes settled agent earnings into payouts, then marks each paid/failed. */
export function AgentPayoutsPanel() {
  const [payouts, setPayouts] = useState<AgentPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const download = async (payoutId: string) => {
    setDownloadingId(payoutId);
    try {
      await deliveryAdminApi.downloadPayoutStatement(payoutId);
    } finally {
      setDownloadingId(null);
    }
  };

  const load = () => {
    setLoading(true);
    deliveryAdminApi
      .payouts()
      .then(setPayouts)
      .catch(() => setPayouts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

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

  return (
    <section className="space-y-3 border-b border-line pb-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 text-brand" aria-hidden="true" />
          <TextEyebrow className="!mb-0">
            Agent payouts {pendingCount > 0 ? `(${pendingCount} pending)` : ""}
          </TextEyebrow>
        </div>
        <Button size="sm" loading={processing} onClick={() => void process()}>
          <PlayCircle className="size-4" aria-hidden="true" />
          Process settled earnings
        </Button>
      </div>
      {message ? <p className="text-body-sm text-success">{message}</p> : null}
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
      {loading ? (
        <p className="text-body-sm text-ink-muted">Loading payouts...</p>
      ) : payouts.length === 0 ? (
        <p className="text-body-sm text-ink-muted">No agent payouts yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-body-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2 pr-3 font-medium">Agent</th>
                <th className="py-2 pr-3 font-medium">Period</th>
                <th className="py-2 pr-3 font-medium">Amount</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Reference / reason</th>
                <th className="py-2 pr-3 font-medium">Statement</th>
                <th className="py-2 pr-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id} className="border-b border-line/60">
                  <td className="py-2 pr-3">{payout.agentName ?? "—"}</td>
                  <td className="py-2 pr-3 text-ink-muted">
                    {new Date(payout.periodStart).toLocaleDateString()} –{" "}
                    {new Date(payout.periodEnd).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-3 font-mono">
                    ₹{payout.amount.toFixed(2)}
                  </td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={payout.status} />
                  </td>
                  <td className="py-2 pr-3 text-ink-muted">
                    {payout.status === "FAILED"
                      ? payout.failureReason
                      : (payout.paymentReferenceNumber ?? "—")}
                  </td>
                  <td className="py-2 pr-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-medium text-brand hover:underline disabled:opacity-50"
                      disabled={downloadingId === payout.id}
                      onClick={() => void download(payout.id)}
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      PDF
                    </button>
                  </td>
                  <td className="py-2 pr-3">
                    {payout.status === "PENDING" ? (
                      <div className="flex items-center gap-3">
                        <AgentMarkPayoutPaidAction
                          payoutId={payout.id}
                          onDone={load}
                        />
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-body-sm font-medium text-danger hover:underline disabled:opacity-50"
                          disabled={pendingId === payout.id}
                          onClick={() => void fail(payout.id)}
                        >
                          <XCircle className="size-3.5" aria-hidden="true" />
                          Mark failed
                        </button>
                      </div>
                    ) : payout.status === "FAILED" ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-body-sm font-medium text-brand hover:underline disabled:opacity-50"
                        disabled={pendingId === payout.id}
                        onClick={() => void retry(payout.id)}
                      >
                        <RotateCw className="size-3.5" aria-hidden="true" />
                        Retry
                      </button>
                    ) : (
                      <span className="text-ink-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
