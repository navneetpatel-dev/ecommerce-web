"use client";

import { Wallet } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import type { CashDeposit } from "@/features/delivery-dashboard";
import { useCashDepositsPanel } from "../../../hooks/delivery-agents/useCashDepositsPanel.hook";
import { cashDepositsPanelStyles as styles } from "../../../styles/delivery-agents/cashDepositsPanel.styles";
import { CashDepositStatusBadge } from "./CashDepositStatusBadge.component";
import { CashDepositActionButtons } from "./CashDepositActionButtons.component";
import { formatInrExact } from "@/shared/utils/formatting/orderFormat";

/** Hub manager reconciliation queue for agent COD cash-deposit submissions. */
export function CashDepositsPanel() {
  const { deposits, loading, pendingId, error, act, pending } =
    useCashDepositsPanel();

  const columns: DataTableColumn<CashDeposit>[] = [
    {
      id: "agent",
      header: "Agent",
      cell: (row) => row.deliveryAgent?.fullName ?? "—",
    },
    {
      id: "declared",
      header: "Declared",
      className: styles.tableCellMono,
      cell: (row) => formatInrExact(row.amount),
    },
    {
      id: "expected",
      header: "Expected",
      cell: (row) => (
        <span className={styles.expectedCell(row.hasDiscrepancy)}>
          {formatInrExact(row.expectedAmount)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      truncate: false,
      cell: (row) => <CashDepositStatusBadge status={row.status} />,
    },
    {
      id: "note",
      header: "Note",
      className: styles.tableCellMuted,
      cell: (row) =>
        row.status === "REJECTED"
          ? (row.rejectionReason ?? "—")
          : (row.note ?? "—"),
    },
  ];

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Wallet className={styles.headerIcon} aria-hidden="true" />
          <h2 className={styles.title}>COD cash deposits reconciliation</h2>
        </div>
        {pending.length > 0 ? (
          <span className={styles.pendingBadge}>
            {pending.length} pending verification
          </span>
        ) : null}
      </div>
      {error ? <div className={styles.errorAlert}>{error}</div> : null}
      <DataTable
        columns={columns}
        rows={deposits}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage="No cash deposits submitted yet."
        rowDetails={false}
        actions={(row) =>
          row.status === "PENDING" ? (
            <CashDepositActionButtons
              depositId={row.id}
              isPending={pendingId === row.id}
              onAct={act}
            />
          ) : null
        }
      />
    </section>
  );
}
