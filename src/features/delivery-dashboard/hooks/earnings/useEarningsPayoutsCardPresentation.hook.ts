"use client";

import { useCallback, useMemo, useState } from "react";
import { deliveryAgentApi } from "../../api/agent/deliveryAgent.api";
import {
  useMyEarningsLedger,
  useMyPayouts,
  useShiftSummary,
} from "../../api/agent/deliveryAgent.queries";
import { formatInrExact } from "@/shared/utils/formatting/orderFormat";

export interface PayoutTableRowViewModel {
  id: string;
  periodLabel: string;
  amountLabel: string;
  status: string;
  referenceLabel: string;
}

export interface RecentTaskRowViewModel {
  id: string;
  typeLabel: string;
  dateLabel: string;
  amountLabel: string;
}

export function useEarningsPayoutsCardPresentation() {
  const earnings = useMyEarningsLedger();
  const payouts = useMyPayouts();
  const shiftSummary = useShiftSummary();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const earningsData = earnings.data ?? [];
  const payoutsData = payouts.data ?? [];

  const pendingLoading = Boolean(shiftSummary.isLoading);
  const pendingTotal = shiftSummary.data?.pendingEarnings ?? 0;
  const pendingCount = shiftSummary.data?.pendingEarningsCount ?? 0;
  const pendingSummaryLabel = pendingLoading
    ? "Loading pending earnings..."
    : `${formatInrExact(pendingTotal)} pending across ${pendingCount} completed task${pendingCount === 1 ? "" : "s"} — included in the next payout run.`;

  const download = useCallback(async (payoutId: string) => {
    setDownloadingId(payoutId);
    try {
      await deliveryAgentApi.downloadPayoutStatement(payoutId);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const payoutRows: PayoutTableRowViewModel[] = useMemo(
    () =>
      payoutsData.map((payout) => {
        const start = new Date(payout.periodStart).toLocaleDateString();
        const end = new Date(payout.periodEnd).toLocaleDateString();
        const ref =
          payout.status === "FAILED"
            ? (payout.failureReason ?? "—")
            : (payout.paymentReferenceNumber ?? "—");

        return {
          id: payout.id,
          periodLabel: `${start} – ${end}`,
          amountLabel: formatInrExact(payout.amount),
          status: payout.status,
          referenceLabel: ref,
        };
      }),
    [payoutsData],
  );

  const recentTasks: RecentTaskRowViewModel[] = useMemo(
    () =>
      earningsData.slice(0, 10).map((row) => ({
        id: row.id,
        typeLabel: row.sourceType === "DELIVERY" ? "Delivery" : "Pickup",
        dateLabel: new Date(row.earnedAt).toLocaleDateString(),
        amountLabel: formatInrExact(Number(row.amount)),
      })),
    [earningsData],
  );

  return {
    payoutsLoading: payouts.isLoading,
    payoutRows,
    payoutsEmpty: payoutsData.length === 0,
    earningsLoading: earnings.isLoading,
    recentTasks,
    earningsEmpty: earningsData.length === 0,
    downloadingId,
    download,
    pendingLoading,
    pendingTotal,
    pendingCount,
    pendingSummaryLabel,
  };
}
