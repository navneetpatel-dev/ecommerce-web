"use client";

import { Wallet } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { useMyCashDeposits } from "../api/deliveryAgent.queries";
import type { CashDeposit } from "../deliveryAgentPayouts.types";

function CashDepositRow({ deposit }: { deposit: CashDeposit }) {
  const mismatch = Math.abs(deposit.amount - deposit.expectedAmount) > 0.01;
  const expectedAmountClassName = `py-2 pr-3 font-mono ${
    mismatch ? "text-danger" : "text-ink-muted"
  }`;
  const createdAtLabel = new Date(deposit.createdAt).toLocaleDateString();
  const notesText =
    deposit.status === "REJECTED"
      ? deposit.rejectionReason
      : (deposit.note ?? "—");

  return (
    <tr className="border-b border-line/60">
      <td className="py-2 pr-3 text-ink-muted">{createdAtLabel}</td>
      <td className="py-2 pr-3 font-mono">₹{deposit.amount.toFixed(2)}</td>
      <td className={expectedAmountClassName}>
        ₹{deposit.expectedAmount.toFixed(2)}
      </td>
      <td className="py-2 pr-3">
        <StatusBadge status={deposit.status} />
      </td>
      <td className="py-2 pr-3 text-ink-muted">{notesText}</td>
    </tr>
  );
}

export function CashDepositsCard() {
  const deposits = useMyCashDeposits();
  const depositRows = deposits.data ?? [];
  const pending = depositRows.filter((d) => d.status === "PENDING");

  const pendingDepositNoun = pending.length === 1 ? "" : "s";
  const summaryText =
    pending.length > 0
      ? `${pending.length} deposit${pendingDepositNoun} awaiting hub verification.`
      : "Cash you hand over to the hub is reconciled here.";

  const rows = depositRows.map((deposit) => (
    <CashDepositRow key={deposit.id} deposit={deposit} />
  ));

  const bodyContent = deposits.isLoading ? (
    <p className="text-body-sm text-ink-muted">Loading deposits...</p>
  ) : depositRows.length === 0 ? (
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
        <tbody>{rows}</tbody>
      </table>
    </div>
  );

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
        <p className="mt-1 text-[0.875rem] text-ink-muted">{summaryText}</p>
      </div>
      <div className="p-5 md:p-6">{bodyContent}</div>
    </section>
  );
}
