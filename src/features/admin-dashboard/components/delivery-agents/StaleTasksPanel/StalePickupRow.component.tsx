import type { StalePickup } from "@/features/delivery-dashboard";
import { staleTasksPanelStyles } from "../../../styles/delivery-agents/staleTasksPanel.styles";

function hoursSince(dateString: string): number {
  return Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (60 * 60 * 1000),
  );
}

interface StalePickupRowProps {
  pickup: StalePickup;
}

export function StalePickupRow({ pickup }: StalePickupRowProps) {
  return (
    <tr className={staleTasksPanelStyles.tableRow}>
      <td className={staleTasksPanelStyles.tableCellMono}>
        {pickup.id.slice(0, 8)}
      </td>
      <td className={staleTasksPanelStyles.tableCell}>
        {pickup.deliveryAgent?.fullName ?? "—"}
      </td>
      <td className={staleTasksPanelStyles.tableCellMuted}>
        {pickup.pickupFailureReason ?? "—"}
      </td>
      <td className={staleTasksPanelStyles.tableCellWarning}>
        {hoursSince(pickup.updatedAt)}h
      </td>
    </tr>
  );
}
