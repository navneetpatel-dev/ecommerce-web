import type { StalePickup } from "@/features/delivery-dashboard";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { staleTasksPanelStyles as styles } from "../../../styles/delivery-agents/staleTasksPanel.styles";

interface StalePickupsTableProps {
  pickups: StalePickup[];
}

function hoursSince(dateString: string): number {
  return Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (60 * 60 * 1000),
  );
}

const COLUMNS: DataTableColumn<StalePickup>[] = [
  {
    id: "returnId",
    header: "Return ID",
    className: styles.tableCellMono,
    cell: (row) => row.id.slice(0, 8),
  },
  {
    id: "agent",
    header: "Agent",
    cell: (row) => row.deliveryAgent?.fullName ?? "—",
  },
  {
    id: "failureReason",
    header: "Failure reason",
    className: styles.tableCellMuted,
    cell: (row) => row.pickupFailureReason ?? "—",
  },
  {
    id: "stuckFor",
    header: "Stuck for",
    className: styles.tableCellWarning,
    cell: (row) => `${hoursSince(row.updatedAt)}h`,
  },
];

export function StalePickupsTable({ pickups }: StalePickupsTableProps) {
  if (pickups.length === 0) return null;

  return (
    <DataTable
      columns={COLUMNS}
      rows={pickups}
      getRowId={(row) => row.id}
      rowDetails={false}
    />
  );
}
