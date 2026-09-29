import { useMemo } from "react";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import type { PayoutEntry } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

export interface PayoutRowViewModel {
  id: string;
  status: string;
  periodLabel: string;
  amountLabel: string;
  /** What the amount is made of, as the API returned it; null for older payouts. */
  breakdownLabel: string | null;
  detailsLabel: string;
}

function formatPayoutBreakdown(payout: PayoutEntry): string | null {
  if (payout.grossAmount == null) return null;
  return formatLabel(LABELS.payoutBreakdownNote, {
    gross: formatInr(payout.grossAmount),
    tds: formatInr(payout.tdsAmount),
    gst: formatInr(payout.commissionGstAmount),
    adjustments: formatInr(payout.adjustmentAmount),
  });
}

function formatPayoutPeriod(payout: PayoutEntry): string {
  const start = formatDate(payout.periodStart);
  const end = formatDate(payout.periodEnd);
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
        breakdownLabel: formatPayoutBreakdown(payout),
        detailsLabel: formatPayoutDetails(payout),
      })),
    [items],
  );

  return { isEmpty, rows };
}
