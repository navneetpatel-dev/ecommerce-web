"use client";

import { useCallback } from "react";
import { PlayCircle, Wallet } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAgentPayoutsPanel } from "../../hooks/useAgentPayoutsPanel.hook";
import { agentPayoutsPanelStyles } from "./agentPayoutsPanel.styles";
import { AgentPayoutTableBody } from "./AgentPayoutTableBody.component";

/** Admin batch-processes settled agent earnings into payouts, then marks each paid/failed. */
export function AgentPayoutsPanel() {
  const {
    payouts,
    loading,
    processing,
    pendingId,
    downloadingId,
    message,
    error,
    pendingCount,
    load,
    download,
    process,
    fail,
    retry,
  } = useAgentPayoutsPanel();

  const handleProcess = useCallback(() => {
    void process();
  }, [process]);

  return (
    <section className={agentPayoutsPanelStyles.root}>
      <div className={agentPayoutsPanelStyles.header}>
        <div className={agentPayoutsPanelStyles.headerLeft}>
          <Wallet
            className={agentPayoutsPanelStyles.headerIcon}
            aria-hidden="true"
          />
          <h2 className={agentPayoutsPanelStyles.title}>
            Agent payouts management
          </h2>
          {pendingCount > 0 ? (
            <span className={agentPayoutsPanelStyles.pendingBadge}>
              {pendingCount} pending
            </span>
          ) : null}
        </div>
        <Button size="sm" loading={processing} onClick={handleProcess}>
          <PlayCircle
            className={agentPayoutsPanelStyles.playIcon}
            aria-hidden="true"
          />
          Process settled earnings
        </Button>
      </div>
      {message ? (
        <div className={agentPayoutsPanelStyles.successAlert}>{message}</div>
      ) : null}
      {error ? (
        <div className={agentPayoutsPanelStyles.errorAlert}>{error}</div>
      ) : null}
      {loading ? (
        <p className={agentPayoutsPanelStyles.loadingText}>
          Loading payouts...
        </p>
      ) : payouts.length === 0 ? (
        <p className={agentPayoutsPanelStyles.emptyText}>
          No agent payouts yet.
        </p>
      ) : (
        <div className={agentPayoutsPanelStyles.tableWrapper}>
          <table className={agentPayoutsPanelStyles.table}>
            <thead>
              <tr className={agentPayoutsPanelStyles.tableHeaderRow}>
                <th className={agentPayoutsPanelStyles.tableHeaderCell}>
                  Agent
                </th>
                <th className={agentPayoutsPanelStyles.tableHeaderCell}>
                  Period
                </th>
                <th className={agentPayoutsPanelStyles.tableHeaderCell}>
                  Amount
                </th>
                <th className={agentPayoutsPanelStyles.tableHeaderCell}>
                  Status
                </th>
                <th className={agentPayoutsPanelStyles.tableHeaderCell}>
                  Reference / reason
                </th>
                <th className={agentPayoutsPanelStyles.tableHeaderCell}>
                  Statement
                </th>
                <th className={agentPayoutsPanelStyles.tableHeaderCell}>
                  Actions
                </th>
              </tr>
            </thead>
            <AgentPayoutTableBody
              payouts={payouts}
              downloadingId={downloadingId}
              pendingId={pendingId}
              onDone={load}
              onDownload={download}
              onFail={fail}
              onRetry={retry}
            />
          </table>
        </div>
      )}
    </section>
  );
}
