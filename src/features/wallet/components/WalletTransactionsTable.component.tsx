"use client";

import { Button } from "@/shared/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import { formatPoints } from "@/shared/utils/formatPoints";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import type { WalletTransaction } from "@/shared/api/types";
import { transactionSourceLabel } from "../utils/transactionSource";

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

function creditAmountClass(isCredit: boolean) {
  return `font-semibold tabular-nums ${isCredit ? "text-success" : "text-ink"}`;
}

function rechargeIdFor(row: WalletTransaction): string | null {
  return row.rechargeId ?? (row.referenceType === "TOPUP" ? row.referenceId : null);
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
      className: "whitespace-nowrap",
      cell: (row) => formatOrderDate(row.createdAt),
    },
    {
      id: "description",
      header: LABELS.walletColumnDescription,
      truncate: true,
      cell: (row) => {
        const sourceLabel = transactionSourceLabel(row);
        const detail =
          row.description && row.description !== sourceLabel
            ? row.description
            : null;
        return (
          <div className="min-w-0">
            <p className="font-medium text-ink">{sourceLabel}</p>
            {detail ? (
              <p className="mt-0.5 text-body-sm text-ink-muted">{detail}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "amount",
      header: LABELS.walletColumnAmount,
      headerClassName: "text-right",
      className: "text-right whitespace-nowrap",
      cell: (row) => {
        const isCredit = row.type === "CREDIT";
        const signedAmount = `${isCredit ? "+" : "−"}${formatPoints(row.amount)}`;
        return <span className={creditAmountClass(isCredit)}>{signedAmount}</span>;
      },
    },
    {
      id: "balance",
      header: LABELS.walletColumnBalance,
      headerClassName: "text-right",
      className: "text-right whitespace-nowrap tabular-nums text-ink-muted",
      hideOnMobile: true,
      cell: (row) => formatPoints(row.balanceAfter),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={transactions}
      loading={loading}
      error={error}
      emptyMessage={LABELS.walletNoTransactions}
      onRefresh={onRetry}
      rowDetails={false}
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDownloadInvoice(rechargeId)}
          >
            {LABELS.walletDownloadRechargeInvoice}
          </Button>
        );
      }}
      actionsHeader={LABELS.actions}
    />
  );
}
