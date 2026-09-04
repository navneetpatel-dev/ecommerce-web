"use client";

import { IndianRupee } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import {
  useMyEarningsLedger,
  useMyPayouts,
} from "../api/deliveryAgent.queries";

export function EarningsPayoutsCard() {
  const earnings = useMyEarningsLedger();
  const payouts = useMyPayouts();
  const pending = (earnings.data ?? []).filter((e) => e.status === "PENDING");
  const pendingTotal = pending.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <IndianRupee className="size-4 text-brand" aria-hidden="true" />
          <TextEyebrow className="!mb-0">EARNINGS &amp; PAYOUTS</TextEyebrow>
        </div>
        <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
          Payout history
        </h2>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          ₹{pendingTotal.toFixed(2)} pending across {pending.length} completed
          task{pending.length === 1 ? "" : "s"} — included in the next payout
          run.
        </p>
      </div>
      <div className="space-y-4 p-5 md:p-6">
        {payouts.isLoading ? (
          <p className="text-body-sm text-ink-muted">Loading payouts...</p>
        ) : (payouts.data ?? []).length === 0 ? (
          <p className="text-body-sm text-ink-muted">No payouts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-body-sm">
              <thead>
                <tr className="border-b border-line text-left text-ink-muted">
                  <th className="py-2 pr-3 font-medium">Period</th>
                  <th className="py-2 pr-3 font-medium">Amount</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payouts.data!.map((payout) => (
                  <tr key={payout.id} className="border-b border-line/60">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-line/60 pt-4">
          <p className="mb-2 text-body-sm font-medium text-ink">
            Recent completed tasks
          </p>
          {earnings.isLoading ? (
            <p className="text-body-sm text-ink-muted">Loading earnings...</p>
          ) : (earnings.data ?? []).length === 0 ? (
            <p className="text-body-sm text-ink-muted">
              No earnings recorded yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {earnings.data!.slice(0, 10).map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between text-body-sm text-ink-muted"
                >
                  <span>
                    {row.sourceType === "DELIVERY" ? "Delivery" : "Pickup"} ·{" "}
                    {new Date(row.earnedAt).toLocaleDateString()}
                  </span>
                  <span className="font-mono text-ink">
                    ₹{Number(row.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
