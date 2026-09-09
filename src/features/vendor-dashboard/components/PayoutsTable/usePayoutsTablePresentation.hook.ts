import { useMemo } from "react";
import { formatInr } from "@/shared/utils/orderFormat";
import type { PayoutEntry } from "@/shared/api/types";

export interface PayoutRowViewModel {
  id: string;
  status: string;
  periodLabel: string;
  amountLabel: string;
  detailsLabel: string;
}

function formatPayoutPeriod(payout: PayoutEntry): string {
  const start = new Date(payout.periodStart).toLocaleDateString();
  const end = new Date(payout.periodEnd).toLocaleDateString();
  return `${start} – ${end}`;
}

function formatPayoutDetails(payout: PayoutEntry): string {
  if (payout.status === "PAID" && payout.paymentReferenceNumber) {
    const method = payout.paymentMethod ?? "Transfer";
    return `${method} · ${payout.paymentReferenceNumber}`;
  }
  if (payout.status === "FAILED" && payout.failureReason) {
    return payout.failureReason;
  }
  return "—";
}

export function usePayoutsTablePresentation(payouts?: {
  items?: PayoutEntry[];
}) {
  const items = payouts?.items ?? [];
  const isEmpty = items.length === 0;

  const rows: PayoutRowViewModel[] = useMemo(
    () =>
      items.map((payout) => ({
        id: payout.id,
        status: payout.status,
        periodLabel: formatPayoutPeriod(payout),
        amountLabel: formatInr(payout.amount),
        detailsLabel: formatPayoutDetails(payout),
      })),
    [items],
  );

  return { isEmpty, rows };
}
