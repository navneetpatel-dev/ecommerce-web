"use client";

import { LABELS } from "@/shared/constants/labels";
import { cashbackWriteOffReportTableStyles as styles } from "./cashbackWriteOffReportTable.styles";

interface MetricCardProps {
  label: string;
  value: string;
  variant?: "default" | "success" | "danger";
}

function MetricCard({ label, value, variant = "default" }: MetricCardProps) {
  return (
    <div className={styles.metricCard}>
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue(variant)}>{value}</p>
    </div>
  );
}

interface CashbackWriteOffMetricsProps {
  recoveredTotal: string;
  writtenOffTotal: string;
}

export function CashbackWriteOffMetrics({
  recoveredTotal,
  writtenOffTotal,
}: CashbackWriteOffMetricsProps) {
  return (
    <div className={styles.summarySection}>
      <h3 className={styles.summaryTitle}>Write-off summary</h3>
      <div className={styles.metricGrid}>
        <MetricCard
          label={LABELS.reportRecoveredTotal}
          value={recoveredTotal}
          variant="success"
        />
        <MetricCard
          label={LABELS.reportWrittenOffTotal}
          value={writtenOffTotal}
        />
      </div>
    </div>
  );
}
