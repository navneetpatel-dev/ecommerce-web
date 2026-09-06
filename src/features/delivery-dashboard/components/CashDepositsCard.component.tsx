"use client";

import { Wallet } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { useMyCashDeposits } from "../api/deliveryAgent.queries";

export function CashDepositsCard() {
  const deposits = useMyCashDeposits();
  const pending = (deposits.data ?? []).filter((d) => d.status === "PENDING");

  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 text-brand" aria-hidden="true" />
          <TextEyebrow className="!mb-0">CASH DEPOSITS</TextEyebrow>
        </div>
        <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
          COD deposit history
        </h2>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          {pending.length > 0
            ? `${pending.length} deposit${pending.length === 1 ? "" : "s"} awaiting hub verification.`
            : "Cash you hand over to the hub is reconciled here."}
        </p>
      </div>
      <div className="p-5 md:p-6">
        {deposits.isLoading ? (
          <p className="text-body-sm text-ink-muted">Loading deposits...</p>
        ) : (deposits.data ?? []).length === 0 ? (
          <p className="text-body-sm text-ink-muted">
            No cash deposits submitted yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-body-sm">
              <thead>
                <tr className="border-b border-line text-left text-ink-muted">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Declared</th>
                  <th className="py-2 pr-3 font-medium">Expected</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {deposits.data!.map((deposit) => {
                  const mismatch =
                    Math.abs(deposit.amount - deposit.expectedAmount) > 0.01;
                  return (
                    <tr key={deposit.id} className="border-b border-line/60">
                      <td className="py-2 pr-3 text-ink-muted">
                        {new Date(deposit.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-3 font-mono">
                        ₹{deposit.amount.toFixed(2)}
                      </td>
                      <td
                        className={`py-2 pr-3 font-mono ${
                          mismatch ? "text-danger" : "text-ink-muted"
                        }`}
                      >
                        ₹{deposit.expectedAmount.toFixed(2)}
                      </td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={deposit.status} />
                      </td>
                      <td className="py-2 pr-3 text-ink-muted">
                        {deposit.status === "REJECTED"
                          ? deposit.rejectionReason
                          : (deposit.note ?? "—")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
