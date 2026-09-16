import { useCallback } from "react";
import type { StaleShipment } from "@/features/delivery-dashboard";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { deliveryForceConfirmLabels } from "@/shared/constants/labels/deliveryForceConfirm";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";
import { staleTasksPanelStyles as styles } from "../../../styles/delivery-agents/staleTasksPanel.styles";

interface StaleShipmentsTableProps {
  shipments: StaleShipment[];
  onForceConfirm: (shipmentId: string, reason: string) => Promise<void>;
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
      header: "Tracking #",
      className: styles.tableCellMono,
      accessor: "trackingNumber",
    },
    {
      id: "status",
      header: "Status",
      truncate: false,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "agent",
      header: "Agent",
      cell: (row) => row.deliveryAgent?.fullName ?? "—",
    },
    {
      id: "stuckFor",
      header: "Stuck for",
      className: styles.tableCellWarning,
      cell: (row) => `${hoursSince(row.updatedAt)}h`,
    },
  ];

  const renderActions = useCallback(
    (shipment: StaleShipment) => {
      if (shipment.status !== "OUT_FOR_DELIVERY") return null;
      return (
        <AdminConfirmAction
          inline
          label={deliveryForceConfirmLabels.forceConfirmDelivery}
          title={deliveryForceConfirmLabels.forceConfirmDeliveryTitle}
          description={deliveryForceConfirmLabels.forceConfirmDeliveryBody}
          dialogVariant="warning"
          tone="archive"
          triggerVariant="outline"
          triggerClassName={styles.confirmTrigger}
          requireReason
          reasonLabel={
            deliveryForceConfirmLabels.forceConfirmDeliveryReasonLabel
          }
          reasonHint={deliveryForceConfirmLabels.forceConfirmDeliveryReasonHint}
          onConfirm={async (reason?: string) => {
            await onForceConfirm(shipment.id, reason ?? "");
          }}
        />
      );
    },
    [onForceConfirm],
  );

  if (shipments.length === 0) return null;

  return (
    <DataTable
      columns={columns}
      rows={shipments}
      getRowId={(row) => row.id}
      rowDetails={false}
      actions={renderActions}
    />
  );
}
