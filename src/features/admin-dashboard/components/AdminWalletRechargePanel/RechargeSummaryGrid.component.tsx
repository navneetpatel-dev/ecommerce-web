import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";
import type { WalletRechargeReport } from "../../api/reports.api";
import { MetricCard } from "../MetricCard.component";

interface RechargeSummaryGridProps {
  report: WalletRechargeReport;
}

export function RechargeSummaryGrid({ report }: RechargeSummaryGridProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-body font-semibold text-ink">
        Recharge summary
      </h3>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={LABELS.reportRechargeInrCollected}
          value={formatInr(report.totalInrCollected)}
          highlight
        />
        <MetricCard
          label={LABELS.reportPointsIssued}
          value={formatPoints(report.pointsIssued)}
        />
        <MetricCard
          label={LABELS.reportRechargeSuccessCount}
          value={String(report.successCount)}
        />
        <MetricCard
          label={LABELS.reportRechargeFailedCount}
          value={String(report.failedCount)}
        />
      </div>
    </div>
  );
}
