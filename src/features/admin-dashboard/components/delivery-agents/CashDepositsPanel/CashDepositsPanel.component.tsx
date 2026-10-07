"use client";

import { LABELS } from "@/shared/constants/labels";

import { Wallet } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import type { CashDeposit } from "@/features/delivery-dashboard";
import { useCashDepositsPanel } from "../../../hooks/delivery-agents/useCashDepositsPanel.hook";
import { cashDepositsPanelStyles as styles } from "../../../styles/delivery-agents/cashDepositsPanel.styles";
import { CashDepositStatusBadge } from "./CashDepositStatusBadge.component";
import { CashDepositActionButtons } from "./CashDepositActionButtons.component";
import { ReasonPromptDialog } from "@/shared/components/dialogs/ReasonPromptDialog.component";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrExact } from "@/shared/utils/formatting/orderFormat";

/** Hub manager reconciliation queue for agent COD cash-deposit submissions. */
export function CashDepositsPanel() {
  const { deposits, loading, pendingId, error, verify, pending, rejectReason } =
    useCashDepositsPanel();

  const columns: DataTableColumn<CashDeposit>[] = [
    {
      id: "agent",
      header: LABELS.agentName,
      cell: (row) => row.deliveryAgent?.fullName ?? "—",
    },
    {
      id: "declared",
      header: LABELS.declaredColumn,
      className: styles.tableCellMono,
      cell: (row) => formatInrExact(row.amount),
    },
    {
      id: "expected",
      header: LABELS.expectedColumn,
      cell: (row) => (
        <span className={styles.expectedCell(row.hasDiscrepancy)}>
          {formatInrExact(row.expectedAmount)}
        </span>
      ),
    },
    {
      id: "status",
      header: LABELS.status,
      truncate: false,
      cell: (row) => <CashDepositStatusBadge status={row.status} />,
    },
    {
      id: "note",
      header: LABELS.noteColumn,
      className: styles.tableCellMuted,
      cell: (row) =>
        row.status === "REJECTED"
          ? (row.rejectionReason ?? "—")
          : (row.note ?? "—"),
    },
  ];

  const renderActions = (row: CashDeposit) =>
    row.status === "PENDING" ? (
      <CashDepositActionButtons
        depositId={row.id}
        isPending={pendingId === row.id}
        onVerify={verify}
        onReject={rejectReason.request}
      />
    ) : null;

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Wallet className={styles.headerIcon} aria-hidden="true" />
          <h2 className={styles.title}>{LABELS.cashDepositsPanelTitle}</h2>
        </div>
        {pending.length > 0 ? (
          <span className={styles.pendingBadge}>
            {formatLabel(LABELS.cashDepositsPendingBadge, {
              count: pending.length,
            })}
          </span>
        ) : null}
      </div>
      {error ? (
        <div role="alert" className={styles.errorAlert}>
          {error}
        </div>
      ) : null}
      <DataTable
        columns={columns}
        rows={deposits}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage={LABELS.noCashDepositsEmpty}
        rowDetails={false}
        actions={renderActions}
      />
      <ReasonPromptDialog
        open={rejectReason.open}
        pending={rejectReason.pending}
        title={LABELS.rejectDepositTitle}
        description={LABELS.rejectDepositBody}
        placeholder={LABELS.rejectDepositPlaceholder}
        confirmLabel={LABELS.reject}
        htmlFor="reject-deposit-reason"
        reason={rejectReason.reason}
        onReasonChange={rejectReason.onReasonChange}
        onOpenChange={rejectReason.onOpenChange}
        onSubmit={rejectReason.onSubmit}
      />
    </section>
  );
}
