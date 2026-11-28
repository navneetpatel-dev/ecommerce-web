"use client";

import { Download } from "lucide-react";
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
import { DataTable, RowActionButton } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import type { WalletTransaction } from "@/shared/api/types";
import { walletTransactionsTableStyles as styles } from "../../styles/transactions/walletTransactionsTable.styles";
import { useWalletTransactionFilters } from "../../hooks/transactions/useWalletTransactionFilters.hook";
import { walletTransactionColumns } from "./walletTransactionColumns.component";

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
  const {
    search,
    setSearch,
    type,
    setType,
    activeCount,
    handleClear,
    filteredTransactions,
  } = useWalletTransactionFilters(transactions);

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
        </div>
      </CollapsibleTableFilters>

      <DataTable
        columns={walletTransactionColumns}
        rows={filteredTransactions}
        loading={loading}
        error={error}
        emptyMessage={LABELS.walletNoTransactions}
        onRefresh={onRetry}
        rowDetails
        showViewButton
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
            <RowActionButton
              icon={Download}
              label={LABELS.walletDownloadRechargeInvoice}
              onClick={handleDownload}
            />
          );
        }}
        actionsHeader={LABELS.actions}
      />
    </div>
  );
}
