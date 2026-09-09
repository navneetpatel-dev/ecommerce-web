import type { DeliveryAgentPerformance } from "@/features/delivery-dashboard";
import { adminDeliveryPerformancePanelStyles } from "../../../styles/delivery-agents/adminDeliveryPerformancePanel.styles";

interface PerformanceTableRowProps {
  row: DeliveryAgentPerformance;
}

export function PerformanceTableRow({ row }: PerformanceTableRowProps) {
  const fulfillmentHoursText =
    row.avgFulfillmentHours != null ? `${row.avgFulfillmentHours}h` : "—";
  const ratingText =
    row.averageRating != null
      ? `${row.averageRating} (${row.ratingCount})`
      : "—";

  return (
    <tr className={adminDeliveryPerformancePanelStyles.tableRow}>
      <td className={adminDeliveryPerformancePanelStyles.tableCell}>
        <div className={adminDeliveryPerformancePanelStyles.agentNameWrapper}>
          {row.fullName}
          {row.flagged ? (
            <span
              title={row.flagReason ?? undefined}
              className={adminDeliveryPerformancePanelStyles.flagBadge}
            >
              Flagged
            </span>
          ) : null}
        </div>
      </td>
      <td className={adminDeliveryPerformancePanelStyles.tableCellMuted}>
        {row.hubOrZone}
      </td>
      <td className={adminDeliveryPerformancePanelStyles.tableCell}>
        {row.delivered}
      </td>
      <td className={adminDeliveryPerformancePanelStyles.tableCell}>
        {row.rto}
      </td>
      <td className={adminDeliveryPerformancePanelStyles.tableCell}>
        {row.rtoRatePercent}%
      </td>
      <td className={adminDeliveryPerformancePanelStyles.tableCell}>
        {row.failedAttempts}
      </td>
      <td className={adminDeliveryPerformancePanelStyles.tableCell}>
        {fulfillmentHoursText}
      </td>
      <td className={adminDeliveryPerformancePanelStyles.tableCell}>
        {ratingText}
      </td>
    </tr>
  );
}
