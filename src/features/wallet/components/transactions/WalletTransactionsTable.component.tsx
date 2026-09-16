"use client";

import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TableRowAction } from "@/shared/components/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { WalletTransaction } from "@/shared/api/types";
import { transactionSourceLabel } from "../../utils/transactions/transactionSource";
import { walletTransactionsTableStyles as styles } from "../../styles/transactions/walletTransactionsTable.styles";

interface WalletTransactionsTableProps {
  transactions: WalletTransaction[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  onDownloadInvoice?: (rechargeId: string) => void;
}

function rechargeIdFor(row: WalletTransaction): string | null {
  return (
    row.rechargeId ?? (row.referenceType === "TOPUP" ? row.referenceId : null)
  );
}

function WalletAmountValue({
  row,
  className,
}: {
  row: WalletTransaction;
  className?: string;
}) {
  const isCredit = row.type === "CREDIT";
  const signedAmount = `${isCredit ? "+" : "−"}${formatPoints(row.amount)}`;
  return (
    <span
      className={cn(
        isCredit ? styles.creditAmountPositive : styles.creditAmountNegative,
        className,
      )}
    >
      {signedAmount}
    </span>
  );
}

export function WalletTransactionsTable({
  transactions,
  loading,
  error,
  onRetry,
  page,
  totalPages,
  total,
  from,
  to,
  onPageChange,
  onDownloadInvoice,
}: WalletTransactionsTableProps) {
  const columns: DataTableColumn<WalletTransaction>[] = [
    {
      id: "date",
      header: LABELS.walletColumnDate,
      headerClassName: styles.colDateHeader,
      className: styles.colDateCell,
      truncate: false,
      cell: (row) => (
        <div className={styles.dateCell}>
          <span className={styles.dateText}>
            {formatOrderDate(row.createdAt)}
          </span>
          <WalletAmountValue row={row} className={styles.mobileAmount} />
        </div>
      ),
    },
    {
      id: "description",
      header: LABELS.walletColumnDescription,
      headerClassName: styles.colDescriptionHeader,
      className: styles.colDescriptionCell,
      mobileRowClassName: styles.mobileDescriptionRow,
      truncate: false,
      cell: (row) => {
        const sourceLabel = transactionSourceLabel(row);
        const detail =
          row.description && row.description !== sourceLabel
            ? row.description
            : null;
        return (
          <div className={styles.descriptionWrapper}>
            <p className={styles.sourceLabel}>{sourceLabel}</p>
            {detail ? <p className={styles.detailLabel}>{detail}</p> : null}
          </div>
        );
      },
    },
    {
      id: "amount",
      header: LABELS.walletColumnAmount,
      headerClassName: styles.colAmountHeader,
      className: styles.colAmountCell,
      hideOnMobile: true,
      cell: (row) => <WalletAmountValue row={row} />,
    },
    {
      id: "balance",
      header: LABELS.walletColumnBalance,
      headerClassName: styles.colBalanceHeader,
      className: styles.colBalanceCell,
      hideOnMobile: true,
      cell: (row) => formatPoints(row.balanceAfter),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={transactions}
      title={
        <h2 className={styles.tableTitle}>{LABELS.walletTransactionHistory}</h2>
      }
      loading={loading}
      error={error}
      emptyMessage={LABELS.walletNoTransactions}
      onRefresh={onRetry}
      rowDetails={false}
      tableLayout="fixed"
      getRowId={(row) => row.id}
      pagination={{
        page,
        totalPages,
        total,
        from,
        to,
        onPageChange,
      }}
      actions={(row) => {
        const rechargeId = rechargeIdFor(row);
        if (!rechargeId || !onDownloadInvoice) return null;
        return (
          <TableRowAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={tableMenuButtonClass("neutral")}
              onClick={() => onDownloadInvoice(rechargeId)}
            >
              <Download strokeWidth={2.25} aria-hidden />
              <span>{LABELS.walletDownloadRechargeInvoice}</span>
            </Button>
          </TableRowAction>
        );
      }}
      actionsHeader={LABELS.actions}
    />
  );
}
