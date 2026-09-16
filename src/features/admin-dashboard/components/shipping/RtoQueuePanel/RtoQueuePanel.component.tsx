"use client";

import { Undo2 } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import type { DeliveryShipment } from "@/features/delivery-dashboard";
import { rtoQueuePanelStyles as styles } from "../../../styles/shipping/rtoQueuePanel.styles";
import { useRtoQueuePanel } from "../../../hooks/shipping/useRtoQueuePanel.hook";

const COLUMNS: DataTableColumn<DeliveryShipment>[] = [
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
    id: "failedAttempts",
    header: "Failed attempts",
    accessor: "failedAttemptCount",
  },
  {
    id: "lastNote",
    header: "Last note",
    className: styles.tableCellMuted,
    cell: (row) => row.failureReason ?? "—",
  },
];

/** Admin/hub visibility into every shipment currently mid-RTO or already handed back. */
export function RtoQueuePanel() {
  const { shipments, loading, pendingCount } = useRtoQueuePanel();

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Undo2 className={styles.headerIcon} aria-hidden="true" />
          <h2 className={styles.title}>Return to Origin (RTO) queue</h2>
        </div>
        {pendingCount > 0 ? (
          <span className={styles.badge}>{pendingCount} awaiting handover</span>
        ) : null}
      </div>
      <DataTable
        columns={COLUMNS}
        rows={shipments}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage="No shipments are currently returning to origin."
        rowDetails={false}
      />
    </section>
  );
}
