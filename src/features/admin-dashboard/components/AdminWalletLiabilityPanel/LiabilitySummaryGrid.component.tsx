import { LABELS } from "@/shared/constants/labels";
import { formatPoints } from "@/shared/utils/formatPoints";
import type { WalletLiabilityReport } from "../../api/reports.api";
import { MetricCard } from "../MetricCard.component";

interface LiabilitySummaryGridProps {
  report: WalletLiabilityReport;
}

export function LiabilitySummaryGrid({ report }: LiabilitySummaryGridProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-body font-semibold text-ink">
        Liability summary
      </h3>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={LABELS.reportTotalLiability}
          value={formatPoints(
            report.totalPointsLiability ?? report.totalLiability,
          )}
          highlight
        />
        <MetricCard
          label={LABELS.reportPurchasedPointsLiability}
          value={formatPoints(report.purchasedPointsLiability ?? 0)}
        />
        <MetricCard
          label={LABELS.reportPromotionalPointsLiability}
          value={formatPoints(report.promotionalPointsLiability ?? 0)}
        />
        <MetricCard
          label={LABELS.reportWalletCustomerCount}
          value={String(report.customerCount)}
        />
      </div>
    </div>
  );
}
