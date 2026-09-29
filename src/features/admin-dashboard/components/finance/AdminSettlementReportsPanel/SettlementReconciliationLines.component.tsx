import { MetricCard } from "../../shared/MetricCard.component";
import type { ReconciliationLine } from "../../../hooks/finance/useSettlementReconciliationLines.hook";
import { adminSettlementReportsPanelStyles } from "../../../styles/finance/adminSettlementReportsPanel.styles";

interface SettlementReconciliationLinesProps {
  lines: ReconciliationLine[];
}

/** The reconciliation identity, one card per line. */
export function SettlementReconciliationLines({
  lines,
}: SettlementReconciliationLinesProps) {
  return (
    <div className={adminSettlementReportsPanelStyles.reconGrid}>
      {lines.map((line) => (
        <MetricCard key={line.key} label={line.label} value={line.value} />
      ))}
    </div>
  );
}
