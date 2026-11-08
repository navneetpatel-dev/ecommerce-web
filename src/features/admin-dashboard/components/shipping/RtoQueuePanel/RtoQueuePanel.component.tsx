"use client";

import { Undo2 } from "lucide-react";
import { DataTable } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import type { RtoQueueShipment } from "../../../api/shipping/shipping.api";
import { rtoQueuePanelStyles as styles } from "../../../styles/shipping/rtoQueuePanel.styles";
import { useRtoQueuePanel } from "../../../hooks/shipping/useRtoQueuePanel.hook";

const getRowId = (row: RtoQueueShipment) => row.id;

/** Every shipment returning to origin or already received back, with the "received" action. */
export function RtoQueuePanel() {
  const { visible, shipments, columns, loading, pendingBadge } =
    useRtoQueuePanel();
  if (!visible) return null;

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Undo2 className={styles.headerIcon} aria-hidden="true" />
          <h2 className={styles.title}>{LABELS.rtoQueueTitle}</h2>
        </div>
        {pendingBadge ? (
          <span className={styles.badge}>{pendingBadge}</span>
        ) : null}
      </div>
      <DataTable
        ariaLabel={LABELS.rtoQueueTableAria}
        columns={columns}
        rows={shipments}
        getRowId={getRowId}
        loading={loading}
        emptyMessage={LABELS.rtoQueueEmpty}
        rowDetails={false}
      />
    </section>
  );
}
