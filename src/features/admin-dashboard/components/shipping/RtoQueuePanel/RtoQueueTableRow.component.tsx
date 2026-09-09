import type { DeliveryShipment } from "@/features/delivery-dashboard";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { rtoQueuePanelStyles } from "../../../styles/shipping/rtoQueuePanel.styles";

interface RtoQueueTableRowProps {
  shipment: DeliveryShipment;
}

export function RtoQueueTableRow({ shipment }: RtoQueueTableRowProps) {
  return (
    <tr className={rtoQueuePanelStyles.tableRow}>
      <td className={rtoQueuePanelStyles.tableCellMono}>
        {shipment.trackingNumber}
      </td>
      <td className={rtoQueuePanelStyles.tableCell}>
        <StatusBadge status={shipment.status} />
      </td>
      <td className={rtoQueuePanelStyles.tableCell}>
        {shipment.deliveryAgent?.fullName ?? "—"}
      </td>
      <td className={rtoQueuePanelStyles.tableCell}>
        {shipment.failedAttemptCount}
      </td>
      <td className={rtoQueuePanelStyles.tableCellMuted}>
        {shipment.failureReason ?? "—"}
      </td>
    </tr>
  );
}
