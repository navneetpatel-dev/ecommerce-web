import type { StalePickup } from "@/features/delivery-dashboard";
import { TableScrollShell } from "@/shared/components/DataTable/TableScrollShell.component";
import { staleTasksPanelStyles } from "../../../styles/delivery-agents/staleTasksPanel.styles";
import { StalePickupRow } from "./StalePickupRow.component";

interface StalePickupsTableProps {
  pickups: StalePickup[];
}

export function StalePickupsTable({ pickups }: StalePickupsTableProps) {
  if (pickups.length === 0) return null;

  return (
    <TableScrollShell>
      <table className={staleTasksPanelStyles.table}>
        <thead>
          <tr className={staleTasksPanelStyles.tableHeaderRow}>
            <th className={staleTasksPanelStyles.tableHeaderCell}>Return ID</th>
            <th className={staleTasksPanelStyles.tableHeaderCell}>Agent</th>
            <th className={staleTasksPanelStyles.tableHeaderCell}>
              Failure reason
            </th>
            <th className={staleTasksPanelStyles.tableHeaderCell}>Stuck for</th>
          </tr>
        </thead>
        <tbody>
          {pickups.map((pickup) => (
            <StalePickupRow key={pickup.id} pickup={pickup} />
          ))}
        </tbody>
      </table>
    </TableScrollShell>
  );
}
