import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import {
  type DataTableColumn,
  CopyableText,
} from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import type { RtoQueueShipment } from "../../api/shipping/shipping.api";
import { RtoReceivedAction } from "../../components/shipping/RtoQueuePanel/RtoReceivedAction.component";
import { rtoQueuePanelStyles as styles } from "../../styles/shipping/rtoQueuePanel.styles";

export function buildRtoQueueColumns(): DataTableColumn<RtoQueueShipment>[] {
  return [
    {
      id: "tracking",
      header: LABELS.trackingNumber,
      className: styles.tableCellMono,
      cell: (row) =>
        row.trackingNumber ? <CopyableText value={row.trackingNumber} /> : "—",
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
  ];
}

/** The ⋮ menu of one returning shipment. */
export function buildRtoQueueActions(
  pendingShipmentId: string | null,
  onMarkReceived: (shipmentId: string) => void,
) {
  return function renderRtoActions(row: RtoQueueShipment) {
    return (
      <RtoReceivedAction
        shipmentId={row.id}
        status={row.status}
        isPending={pendingShipmentId === row.id}
        onMarkReceived={onMarkReceived}
      />
    );
  };
}
