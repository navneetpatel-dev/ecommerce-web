import type { StaleShipment } from "@/features/delivery-dashboard";
import { staleTasksPanelStyles } from "../../../styles/delivery-agents/staleTasksPanel.styles";
import { StaleShipmentRow } from "./StaleShipmentRow.component";

interface StaleShipmentsTableProps {
  shipments: StaleShipment[];
  onForceConfirm: (shipmentId: string, reason: string) => Promise<void>;
}

export function StaleShipmentsTable({
  shipments,
  onForceConfirm,
}: StaleShipmentsTableProps) {
  if (shipments.length === 0) return null;

  return (
    <div className={staleTasksPanelStyles.tableWrapper}>
      <table className={staleTasksPanelStyles.table}>
        <thead>
          <tr className={staleTasksPanelStyles.tableHeaderRow}>
            <th className={staleTasksPanelStyles.tableHeaderCell}>
              Tracking #
            </th>
            <th className={staleTasksPanelStyles.tableHeaderCell}>Status</th>
            <th className={staleTasksPanelStyles.tableHeaderCell}>Agent</th>
            <th className={staleTasksPanelStyles.tableHeaderCell}>Stuck for</th>
            <th className={staleTasksPanelStyles.tableHeaderCellRight}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <StaleShipmentRow
              key={shipment.id}
              shipment={shipment}
              onForceConfirm={onForceConfirm}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
