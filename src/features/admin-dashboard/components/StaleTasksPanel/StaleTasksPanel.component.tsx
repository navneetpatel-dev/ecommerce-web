"use client";

import { AlertTriangle } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { staleTasksPanelStyles } from "./staleTasksPanel.styles";
import { useStaleTasksReport } from "./useStaleTasksReport.hook";
import { StaleShipmentsTable } from "./StaleShipmentsTable.component";
import { StalePickupsTable } from "./StalePickupsTable.component";

/** Admin visibility into shipments/pickups stuck mid-transit past a reasonable window. */
export function StaleTasksPanel() {
  const { report, loading, total, forceConfirmDelivery } =
    useStaleTasksReport();

  return (
    <section className={staleTasksPanelStyles.root}>
      <div className={staleTasksPanelStyles.header}>
        <AlertTriangle
          className={staleTasksPanelStyles.headerIcon}
          aria-hidden="true"
        />
        <TextEyebrow className="!mb-0">
          Stuck tasks {total > 0 ? `(${total})` : ""}
        </TextEyebrow>
      </div>
      {loading ? (
        <p className={staleTasksPanelStyles.loadingText}>
          Checking for stuck tasks...
        </p>
      ) : total === 0 ? (
        <p className={staleTasksPanelStyles.emptyText}>
          Nothing is stuck beyond the usual window right now.
        </p>
      ) : (
        <div className={staleTasksPanelStyles.tablesWrapper}>
          <StaleShipmentsTable
            shipments={report.shipments}
            onForceConfirm={forceConfirmDelivery}
          />
          <StalePickupsTable pickups={report.pickups} />
        </div>
      )}
    </section>
  );
}
