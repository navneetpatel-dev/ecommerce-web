"use client";

import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TableRowAction } from "@/shared/components/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
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
  return (
    row.rechargeId ?? (row.referenceType === "TOPUP" ? row.referenceId : null)
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
      headerClassName: "w-[16%]",
      className: "w-[16%] whitespace-nowrap",
      cell: (row) => formatOrderDate(row.createdAt),
    },
    {
      id: "description",
      header: LABELS.walletColumnDescription,
      headerClassName: "w-[46%]",
      className: "w-[46%]",
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
      headerClassName: "w-[16%] text-right",
      className: "w-[16%] whitespace-nowrap text-right",
      cell: (row) => {
        const isCredit = row.type === "CREDIT";
        const signedAmount = `${isCredit ? "+" : "−"}${formatPoints(row.amount)}`;
        return (
          <span className={creditAmountClass(isCredit)}>{signedAmount}</span>
        );
      },
    },
    {
      id: "balance",
      header: LABELS.walletColumnBalance,
      headerClassName: "w-[16%] text-right",
      className:
        "w-[16%] whitespace-nowrap text-right tabular-nums text-ink-muted",
      hideOnMobile: true,
      cell: (row) => formatPoints(row.balanceAfter),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={transactions}
      title={
        <h2 className="text-body font-semibold text-ink">
          {LABELS.walletTransactionHistory}
        </h2>
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
