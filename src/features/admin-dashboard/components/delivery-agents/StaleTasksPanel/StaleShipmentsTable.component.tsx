import { useCallback } from "react";
import type { StaleShipment } from "@/features/delivery-dashboard";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import type { ForceConfirmFn } from "../../../hooks/delivery-agents/useStaleShipmentForceConfirm.hook";
import { StaleShipmentForceConfirm } from "./StaleShipmentForceConfirm.component";
import { staleTasksPanelStyles as styles } from "../../../styles/delivery-agents/staleTasksPanel.styles";

interface StaleShipmentsTableProps {
  shipments: StaleShipment[];
  onForceConfirm: ForceConfirmFn;
}

function hoursSince(dateString: string): number {
  return Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (60 * 60 * 1000),
  );
}

export function StaleShipmentsTable({
  shipments,
  onForceConfirm,
}: StaleShipmentsTableProps) {
  const columns: DataTableColumn<StaleShipment>[] = [
    {
      id: "tracking",
      header: LABELS.trackingNumber,
      className: styles.tableCellMono,
      accessor: "trackingNumber",
    },
    {
      id: "status",
      header: LABELS.status,
      truncate: false,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "agent",
      header: LABELS.agentName,
      cell: (row) => row.deliveryAgent?.fullName ?? "—",
    },
    {
      id: "stuckFor",
      header: LABELS.flagsStuckFor,
      className: styles.tableCellWarning,
      cell: (row) => `${hoursSince(row.updatedAt)}h`,
    },
  ];

  const renderActions = useCallback(
    (shipment: StaleShipment) => {
      if (shipment.status !== "OUT_FOR_DELIVERY") return null;
      return (
        <StaleShipmentForceConfirm
          shipment={shipment}
          onForceConfirm={onForceConfirm}
        />
      );
    },
    [onForceConfirm],
  );

  if (shipments.length === 0) return null;

  return (
    <DataTable
      ariaLabel={LABELS.staleShipmentsTableAria}

      columns={columns}
      rows={shipments}
      getRowId={(row) => row.id}
      rowDetails={false}
      actions={renderActions}
    />
  );
}
