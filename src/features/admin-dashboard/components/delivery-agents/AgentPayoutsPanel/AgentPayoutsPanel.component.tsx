"use client";

import { useCallback } from "react";
import { PlayCircle, Wallet } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import type { AgentPayout } from "@/features/delivery-dashboard";
import { useAgentPayoutsPanel } from "../../../hooks/delivery-agents/useAgentPayoutsPanel.hook";
import { agentPayoutsPanelStyles as styles } from "../../../styles/delivery-agents/agentPayoutsPanel.styles";
import { AgentPayoutActions } from "./AgentPayoutActions.component";
import { AgentPayoutStatementButton } from "./AgentPayoutStatementButton.component";
import { ReasonPromptDialog } from "@/shared/components/dialogs/ReasonPromptDialog.component";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrExact } from "@/shared/utils/formatting/orderFormat";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import { LABELS } from "@/shared/constants/labels";

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
    retry,
    requestFail,
    failReason,
  } = useAgentPayoutsPanel();

  const handleProcess = useCallback(() => {
    void process();
  }, [process]);

  const handleDownload = useCallback(
    (payoutId: string) => {
      void download(payoutId);
    },
    [download],
  );

  const columns: DataTableColumn<AgentPayout>[] = [
    {
      id: "agent",
      header: LABELS.agentName,
      className: styles.tableCellMedium,
      cell: (row) => row.agentName ?? "—",
    },
    {
      id: "period",
      header: LABELS.periodColumn,
      className: styles.tableCellMuted,
      cell: (row) =>
        `${formatDate(row.periodStart)} – ${formatDate(row.periodEnd)}`,
    },
    {
      id: "amount",
      header: LABELS.agentPayoutGross,
      className: styles.tableCellAmount,
      cell: (row) => formatInrExact(row.amount),
    },
    {
      id: "tds",
      header: LABELS.agentPayoutTds,
      className: styles.tableCellAmount,
      cell: (row) => formatInrExact(row.tdsAmount),
    },
    {
      id: "net",
      header: LABELS.agentPayoutNet,
      className: styles.tableCellAmount,
      cell: (row) => formatInrExact(row.netAmount),
    },
    {
      id: "status",
      header: LABELS.status,
      truncate: false,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "reference",
      header: LABELS.referenceReasonColumn,
      className: styles.tableCellMuted,
      cell: (row) =>
        row.status === "FAILED"
          ? (row.failureReason ?? "—")
          : (row.paymentReferenceNumber ?? "—"),
    },
    {
      id: "statement",
      header: LABELS.commissionStatement,
      truncate: false,
      cell: (row) => (
        <AgentPayoutStatementButton
          payoutId={row.id}
          isDownloading={downloadingId === row.id}
          onDownload={handleDownload}
        />
      ),
    },
  ];

  const renderActions = (row: AgentPayout) => (
    <AgentPayoutActions
      payoutId={row.id}
      status={row.status}
      pendingId={pendingId}
      onDone={load}
      onRequestFail={requestFail}
      onRetry={retry}
    />
  );

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Wallet className={styles.headerIcon} aria-hidden="true" />
          <h2 className={styles.title}>{LABELS.agentPayoutsPanelTitle}</h2>
          {pendingCount > 0 ? (
            <span className={styles.pendingBadge}>
              {formatLabel(LABELS.agentPayoutsPendingBadge, {
                count: pendingCount,
              })}
            </span>
          ) : null}
        </div>
        <Button size="sm" loading={processing} onClick={handleProcess}>
          <PlayCircle className={styles.playIcon} aria-hidden="true" />
          {LABELS.processSettledEarnings}
        </Button>
      </div>
      {message ? (
        <div role="status" className={styles.successAlert}>
          {message}
        </div>
      ) : null}
      {error ? (
        <div role="alert" className={styles.errorAlert}>
          {error}
        </div>
      ) : null}
      <DataTable
        ariaLabel={LABELS.agentPayoutsTableAria}

        columns={columns}
        rows={payouts}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage={LABELS.noPayoutsEmpty}
        rowDetails={false}
        actions={renderActions}
      />
      <ReasonPromptDialog
        open={failReason.open}
        pending={failReason.pending}
        title={LABELS.failPayoutTitle}
        description={LABELS.failPayoutBody}
        placeholder={LABELS.failPayoutPlaceholder}
        confirmLabel={LABELS.markPayoutFailed}
        htmlFor="fail-payout-reason"
        reason={failReason.reason}
        onReasonChange={failReason.onReasonChange}
        onOpenChange={failReason.onOpenChange}
        onSubmit={failReason.onSubmit}
      />
    </section>
  );
}
