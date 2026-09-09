"use client";

import { Download, PlayCircle, RotateCw, Wallet, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { useAgentPayoutsPanel } from "../hooks/useAgentPayoutsPanel.hook";
import { AgentMarkPayoutPaidAction } from "./AgentMarkPayoutPaidAction.component";

/** Admin batch-processes settled agent earnings into payouts, then marks each paid/failed. */
export function AgentPayoutsPanel() {
  const {
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
  } = useAgentPayoutsPanel();

  return (
    <section className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Wallet className="size-5 text-brand" aria-hidden="true" />
          <h2 className="font-display text-[1.125rem] font-semibold text-ink">
            Agent payouts management
          </h2>
          {pendingCount > 0 ? (
            <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-caption font-semibold text-warning">
              {pendingCount} pending
            </span>
          ) : null}
        </div>
        <Button size="sm" loading={processing} onClick={() => void process()}>
          <PlayCircle className="size-4" aria-hidden="true" />
          Process settled earnings
        </Button>
      </div>
      {message ? (
        <div className="rounded-md border border-success/30 bg-success/10 px-3.5 py-2.5 text-body-sm font-medium text-success">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-body-sm font-medium text-danger">
          {error}
        </div>
      ) : null}
      {loading ? (
        <p className="text-body-sm text-ink-muted">Loading payouts...</p>
      ) : payouts.length === 0 ? (
        <p className="py-6 text-center text-body-sm text-ink-muted">
          No agent payouts yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-body-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2.5 pr-3 font-medium">Agent</th>
                <th className="py-2.5 pr-3 font-medium">Period</th>
                <th className="py-2.5 pr-3 font-medium">Amount</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 pr-3 font-medium">Reference / reason</th>
                <th className="py-2.5 pr-3 font-medium">Statement</th>
                <th className="py-2.5 pr-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr
                  key={payout.id}
                  className="border-b border-line/60 hover:bg-paper/40 transition-colors"
                >
                  <td className="py-2.5 pr-3 font-medium">
                    {payout.agentName ?? "—"}
                  </td>
                  <td className="py-2.5 pr-3 text-ink-muted">
                    {new Date(payout.periodStart).toLocaleDateString()} –{" "}
                    {new Date(payout.periodEnd).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 pr-3 font-mono font-semibold">
                    ₹{payout.amount.toFixed(2)}
                  </td>
                  <td className="py-2.5 pr-3">
                    <StatusBadge status={payout.status} />
                  </td>
                  <td className="py-2.5 pr-3 text-ink-muted">
                    {payout.status === "FAILED"
                      ? payout.failureReason
                      : (payout.paymentReferenceNumber ?? "—")}
                  </td>
                  <td className="py-2.5 pr-3">
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
                  <td className="py-2.5 pr-3">
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
