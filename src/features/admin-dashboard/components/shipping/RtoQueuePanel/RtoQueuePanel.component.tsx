"use client";

import { LABELS } from "@/shared/constants/labels";

import { Undo2 } from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import type { DeliveryShipment } from "@/features/delivery-dashboard";
import { rtoQueuePanelStyles as styles } from "../../../styles/shipping/rtoQueuePanel.styles";
import { useRtoQueuePanel } from "../../../hooks/shipping/useRtoQueuePanel.hook";

const COLUMNS: DataTableColumn<DeliveryShipment>[] = [
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
        ariaLabel={LABELS.rtoQueueTableAria}

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
