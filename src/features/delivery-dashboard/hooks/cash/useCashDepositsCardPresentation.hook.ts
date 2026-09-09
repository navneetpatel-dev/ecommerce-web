"use client";

import { useMemo } from "react";
import { useMyCashDeposits } from "../../api/agent/deliveryAgent.queries";

export interface CashDepositRowViewModel {
  id: string;
  createdAtLabel: string;
  amountLabel: string;
  expectedAmountLabel: string;
  mismatch: boolean;
  status: string;
  notesText: string;
}

export function useCashDepositsCardPresentation() {
  const deposits = useMyCashDeposits();
  const depositRows = deposits.data ?? [];

  const { rows, summaryText } = useMemo(() => {
    const pending = depositRows.filter((d) => d.status === "PENDING");
    const noun = pending.length === 1 ? "" : "s";
    const text =
      pending.length > 0
        ? `${pending.length} deposit${noun} awaiting hub verification.`
        : "Cash you hand over to the hub is reconciled here.";

    const mappedRows: CashDepositRowViewModel[] = depositRows.map((deposit) => {
      const mismatch = Math.abs(deposit.amount - deposit.expectedAmount) > 0.01;
      const notesText =
        deposit.status === "REJECTED"
          ? (deposit.rejectionReason ?? "—")
          : (deposit.note ?? "—");

      return {
        id: deposit.id,
        createdAtLabel: new Date(deposit.createdAt).toLocaleDateString(),
        amountLabel: `₹${deposit.amount.toFixed(2)}`,
        expectedAmountLabel: `₹${deposit.expectedAmount.toFixed(2)}`,
        mismatch,
        status: deposit.status,
        notesText,
      };
    });

    return { rows: mappedRows, summaryText: text };
  }, [depositRows]);

  return {
    isLoading: deposits.isLoading,
    isEmpty: depositRows.length === 0,
    rows,
    summaryText,
  };
}
