import { useMemo } from "react";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

export interface Commission {
  id: string;
  createdAt: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
  tdsAmount?: number | null;
  tdsRatePercent?: number | null;
  gstAmount?: number | null;
}

export interface CommissionRowViewModel {
  id: string;
  status: string;
  dateLabel: string;
  saleAmountLabel: string;
  rateLabel: string;
  commissionAmountLabel: string;
  gstAmountLabel: string;
  tdsAmountLabel: string;
  tdsRateLabel: string;
}

function formatTdsRate(rate?: number | null) {
  return rate == null ? "—" : `${rate}%`;
}

function formatOrDash(amount?: number | null) {
  return amount == null ? "—" : formatInr(amount);
}

export function useCommissionLedgerPresentation(commissions?: {
  items?: Commission[];
}) {
  const items = commissions?.items ?? [];
  const isEmpty = items.length === 0;

  const rows: CommissionRowViewModel[] = useMemo(
    () =>
      items.map((c) => ({
        id: c.id,
        status: c.status,
        dateLabel: new Date(c.createdAt).toLocaleDateString(),
        saleAmountLabel: formatInr(c.saleAmount),
        rateLabel: `${c.commissionRate}%`,
        commissionAmountLabel: formatInr(c.commissionAmount),
        gstAmountLabel: formatOrDash(c.gstAmount),
        tdsAmountLabel: formatOrDash(c.tdsAmount),
        tdsRateLabel: formatTdsRate(c.tdsRatePercent),
      })),
    [items],
  );

  return { isEmpty, rows };
}
