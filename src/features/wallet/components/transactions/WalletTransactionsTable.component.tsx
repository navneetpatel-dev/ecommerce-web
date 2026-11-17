"use client";

import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { TableRowAction } from "@/shared/components/DataTable/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
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
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const desc = (t.description ?? "").toLowerCase();
        const refType = (t.referenceType ?? "").toLowerCase();
        const refId = (t.referenceId ?? "").toLowerCase();
        if (!desc.includes(q) && !refType.includes(q) && !refId.includes(q)) {
          return false;
        }
      }
      if (type && t.type !== type) return false;
      return true;
    });
  }, [transactions, search, type]);

  const activeCount = (search.trim() ? 1 : 0) + (type ? 1 : 0);
  const handleClear = () => {
    setSearch("");
    setType("");
  };

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
        const rawDetail =
          row.description && row.description !== sourceLabel
            ? row.description
            : null;
        const detail = rawDetail
          ? rawDetail
              .replace(
                /#?[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})?\b/gi,
                "",
              )
              .replace(/\s{2,}/g, " ")
              .trim() || null
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={styles.tableTitle}>{LABELS.walletTransactionHistory}</h2>
      </div>

      <CollapsibleTableFilters activeCount={activeCount} onClear={handleClear}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame label={LABELS.search} htmlFor="wallet-filter-search">
            <Input
              id="wallet-filter-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by description or reference..."
            />
          </FormFieldFrame>

          <FormFieldFrame label="Transaction Type" htmlFor="wallet-filter-type">
            <Select
              value={type || "__ALL__"}
              onValueChange={(val) => setType(val === "__ALL__" ? "" : val)}
            >
              <SelectTrigger id="wallet-filter-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">All Types</SelectItem>
                <SelectItem value="CREDIT">Credits (+)</SelectItem>
                <SelectItem value="DEBIT">Debits (−)</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>

          {activeCount > 0 && (
            <div className="flex items-end">
              <Button type="button" variant="outline" onClick={handleClear}>
                {LABELS.clearFilters}
              </Button>
            </div>
          )}
        </div>
      </CollapsibleTableFilters>

      <DataTable
        columns={columns}
        rows={filteredTransactions}
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
          const handleDownload = () => onDownloadInvoice(rechargeId);
          return (
            <TableRowAction>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={tableMenuButtonClass("neutral")}
                onClick={handleDownload}
              >
                <Download strokeWidth={2.25} aria-hidden />
                <span>{LABELS.walletDownloadRechargeInvoice}</span>
              </Button>
            </TableRowAction>
          );
        }}
        actionsHeader={LABELS.actions}
      />
    </div>
  );
}
