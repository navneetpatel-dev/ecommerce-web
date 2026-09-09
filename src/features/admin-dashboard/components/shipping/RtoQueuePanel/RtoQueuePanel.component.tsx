"use client";

import { Undo2 } from "lucide-react";
import { rtoQueuePanelStyles } from "../../../styles/shipping/rtoQueuePanel.styles";
import { useRtoQueuePanel } from "../../../hooks/shipping/useRtoQueuePanel.hook";
import { RtoQueueTableBody } from "./RtoQueueTableBody.component";

/** Admin/hub visibility into every shipment currently mid-RTO or already handed back. */
export function RtoQueuePanel() {
  const { shipments, loading, pendingCount } = useRtoQueuePanel();

  return (
    <section className={rtoQueuePanelStyles.root}>
      <div className={rtoQueuePanelStyles.header}>
        <div className={rtoQueuePanelStyles.headerLeft}>
          <Undo2
            className={rtoQueuePanelStyles.headerIcon}
            aria-hidden="true"
          />
          <h2 className={rtoQueuePanelStyles.title}>
            Return to Origin (RTO) queue
          </h2>
        </div>
        {pendingCount > 0 ? (
          <span className={rtoQueuePanelStyles.badge}>
            {pendingCount} awaiting handover
          </span>
        ) : null}
      </div>
      {loading ? (
        <p className={rtoQueuePanelStyles.loadingText}>Loading RTO queue...</p>
      ) : shipments.length === 0 ? (
        <p className={rtoQueuePanelStyles.emptyText}>
          No shipments are currently returning to origin.
        </p>
      ) : (
        <div className={rtoQueuePanelStyles.tableWrapper}>
          <table className={rtoQueuePanelStyles.table}>
            <thead>
              <tr className={rtoQueuePanelStyles.tableHeaderRow}>
                <th className={rtoQueuePanelStyles.tableHeaderCell}>
                  Tracking #
                </th>
                <th className={rtoQueuePanelStyles.tableHeaderCell}>Status</th>
                <th className={rtoQueuePanelStyles.tableHeaderCell}>Agent</th>
                <th className={rtoQueuePanelStyles.tableHeaderCell}>
                  Failed attempts
                </th>
                <th className={rtoQueuePanelStyles.tableHeaderCell}>
                  Last note
                </th>
              </tr>
            </thead>
            <RtoQueueTableBody shipments={shipments} />
          </table>
        </div>
      )}
    </section>
  );
}
