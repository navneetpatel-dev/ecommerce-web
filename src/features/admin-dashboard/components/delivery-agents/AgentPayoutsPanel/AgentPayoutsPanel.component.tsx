"use client";

import { useCallback } from "react";
import { Download, PlayCircle, Wallet } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import type { AgentPayout } from "@/features/delivery-dashboard";
import { useAgentPayoutsPanel } from "../../../hooks/delivery-agents/useAgentPayoutsPanel.hook";
import { agentPayoutsPanelStyles as styles } from "../../../styles/delivery-agents/agentPayoutsPanel.styles";
import { AgentPayoutActions } from "./AgentPayoutActions.component";
import { formatInrExact } from "@/shared/utils/formatting/orderFormat";

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

  const columns: DataTableColumn<AgentPayout>[] = [
    {
      id: "agent",
      header: "Agent",
      className: styles.tableCellMedium,
      cell: (row) => row.agentName ?? "—",
    },
    {
      id: "period",
      header: "Period",
      className: styles.tableCellMuted,
      cell: (row) =>
        `${new Date(row.periodStart).toLocaleDateString()} – ${new Date(row.periodEnd).toLocaleDateString()}`,
    },
    {
      id: "amount",
      header: "Amount",
      className: styles.tableCellAmount,
      cell: (row) => formatInrExact(row.amount),
    },
    {
      id: "status",
      header: "Status",
      truncate: false,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "reference",
      header: "Reference / reason",
      className: styles.tableCellMuted,
      cell: (row) =>
        row.status === "FAILED"
          ? (row.failureReason ?? "—")
          : (row.paymentReferenceNumber ?? "—"),
    },
    {
      id: "statement",
      header: "Statement",
      truncate: false,
      cell: (row) => (
        <button
          type="button"
          className={styles.pdfButton}
          disabled={downloadingId === row.id}
          onClick={() => {
            void download(row.id);
          }}
        >
          <Download className={styles.actionIcon} aria-hidden="true" />
          PDF
        </button>
      ),
    },
  ];

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Wallet className={styles.headerIcon} aria-hidden="true" />
          <h2 className={styles.title}>Agent payouts management</h2>
          {pendingCount > 0 ? (
            <span className={styles.pendingBadge}>{pendingCount} pending</span>
          ) : null}
        </div>
        <Button size="sm" loading={processing} onClick={handleProcess}>
          <PlayCircle className={styles.playIcon} aria-hidden="true" />
          Process settled earnings
        </Button>
      </div>
      {message ? <div className={styles.successAlert}>{message}</div> : null}
      {error ? <div className={styles.errorAlert}>{error}</div> : null}
      <DataTable
        columns={columns}
        rows={payouts}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage="No agent payouts yet."
        rowDetails={false}
        actions={(row) => (
          <AgentPayoutActions
            payoutId={row.id}
            status={row.status}
            pendingId={pendingId}
            onDone={load}
            onFail={fail}
            onRetry={retry}
          />
        )}
      />
    </section>
  );
}
