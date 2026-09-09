"use client";

import { IndianRupee } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { earningsPayoutsCardStyles } from "./earningsPayoutsCard.styles";
import { useEarningsPayoutsCardPresentation } from "./useEarningsPayoutsCardPresentation.hook";
import { EarningsPayoutsTable } from "./EarningsPayoutsTable.component";
import { RecentCompletedTasksList } from "./RecentCompletedTasksList.component";

export function EarningsPayoutsCard() {
  const {
    payoutsLoading,
    payoutRows,
    payoutsEmpty,
    earningsLoading,
    recentTasks,
    earningsEmpty,
    downloadingId,
    download,
    pendingTotal,
    pendingCount,
  } = useEarningsPayoutsCardPresentation();

  return (
    <section className={earningsPayoutsCardStyles.container}>
      <div className={earningsPayoutsCardStyles.header}>
        <div className={earningsPayoutsCardStyles.headerTop}>
          <IndianRupee
            className={earningsPayoutsCardStyles.headerIcon}
            aria-hidden="true"
          />
          <TextEyebrow className={earningsPayoutsCardStyles.headerEyebrow}>
            EARNINGS &amp; PAYOUTS
          </TextEyebrow>
        </div>
        <h2 className={earningsPayoutsCardStyles.title}>Payout history</h2>
        <p className={earningsPayoutsCardStyles.subtitle}>
          ₹{pendingTotal.toFixed(2)} pending across {pendingCount} completed
          task
          {pendingCount === 1 ? "" : "s"} — included in the next payout run.
        </p>
      </div>

      <div className={earningsPayoutsCardStyles.body}>
        {payoutsLoading ? (
          <p className={earningsPayoutsCardStyles.emptyText}>
            Loading payouts...
          </p>
        ) : payoutsEmpty ? (
          <p className={earningsPayoutsCardStyles.emptyText}>No payouts yet.</p>
        ) : (
          <EarningsPayoutsTable
            rows={payoutRows}
            downloadingId={downloadingId}
            onDownload={download}
          />
        )}

        <div className={earningsPayoutsCardStyles.recentSection}>
          <p className={earningsPayoutsCardStyles.recentTitle}>
            Recent completed tasks
          </p>
          {earningsLoading ? (
            <p className={earningsPayoutsCardStyles.emptyText}>
              Loading earnings...
            </p>
          ) : earningsEmpty ? (
            <p className={earningsPayoutsCardStyles.emptyText}>
              No earnings recorded yet.
            </p>
          ) : (
            <RecentCompletedTasksList tasks={recentTasks} />
          )}
        </div>
      </div>
    </section>
  );
}
