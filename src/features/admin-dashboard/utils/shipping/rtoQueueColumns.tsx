import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import type { DataTableColumn } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import type { RtoQueueShipment } from "../../api/shipping/shipping.api";
import { RtoReceivedAction } from "../../components/shipping/RtoQueuePanel/RtoReceivedAction.component";
import { rtoQueuePanelStyles as styles } from "../../styles/shipping/rtoQueuePanel.styles";

export function buildRtoQueueColumns(
  pendingShipmentId: string | null,
  onMarkReceived: (shipmentId: string) => void,
): DataTableColumn<RtoQueueShipment>[] {
  return [
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
      id: "customer",
      header: LABELS.customerName,
      cell: (row) => row.subOrder?.order?.user?.name ?? "—",
    },
    {
      id: "failedAttempts",
      header: LABELS.flagsFailedAttempts,
      accessor: "failedAttemptCount",
    },
    {
      id: "lastNote",
      header: LABELS.lastNoteColumn,
      className: styles.tableCellMuted,
      cell: (row) => row.failureReason ?? "—",
    },
    {
      id: "actions",
      header: LABELS.actionsColumn,
      truncate: false,
      cell: (row) => (
        <RtoReceivedAction
          shipmentId={row.id}
          status={row.status}
          isPending={pendingShipmentId === row.id}
          onMarkReceived={onMarkReceived}
        />
      ),
    },
  ];
}
