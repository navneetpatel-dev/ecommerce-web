import { useState, useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import type { WalletLiabilityReport } from "../../../api/finance/reports.api";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import { adminWalletLiabilityPanelStyles as styles } from "../../../styles/wallet/adminWalletLiabilityPanel.styles";

type LiabilityRow = WalletLiabilityReport["rows"][number];

interface LiabilityRowsTableProps {
  report: WalletLiabilityReport;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const COLUMNS: DataTableColumn<LiabilityRow>[] = [
  {
    id: "customer",
    header: LABELS.customerName,
    className: styles.cellMuted,
    cell: (row) =>
      row.customerName || row.name || row.email || LABELS.customerName,
  },
  {
    id: "balance",
    header: LABELS.reportBalance,
    className: styles.cellNumBold,
    cell: (row) => formatPoints(row.balance),
  },
  {
    id: "purchasedPoints",
    header: LABELS.reportPurchasedPoints,
    className: styles.cellNum,
    cell: (row) => formatPoints(row.purchasedPoints),
  },
  {
    id: "promotionalPoints",
    header: LABELS.reportPromotionalPoints,
    className: styles.cellNum,
    cell: (row) => formatPoints(row.promotionalPoints),
  },
  {
    id: "asOf",
    header: LABELS.reportAsOf,
    className: styles.cellMuted,
    cell: (row) => formatDate(row.asOf),
  },
];

export function LiabilityRowsTable({
  report,
  page,
  loading,
  onPageChange,
}: LiabilityRowsTableProps) {
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    return report.rows.filter((row) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesName =
          row.customerName?.toLowerCase().includes(q) ||
          (row as unknown as { name?: string }).name?.toLowerCase().includes(q);
        const matchesEmail = (row as unknown as { email?: string }).email
          ?.toLowerCase()
          .includes(q);
        const matchesId = row.userId?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesId) return false;
      }
      return true;
    });
  }, [report.rows, search]);

  const activeCount = search.trim() ? 1 : 0;

  const handleClear = () => {
    setSearch("");
  };

  const pagination = report.pagination
    ? {
        page,
        totalPages: Math.max(1, report.pagination.totalPages),
        total: report.pagination.total,
        from:
          report.pagination.total > 0
            ? (page - 1) * report.pagination.limit + 1
            : 0,
        to: Math.min(page * report.pagination.limit, report.pagination.total),
        onPageChange,
      }
    : undefined;

  return (
    <div>
      {report.rows.length > 0 && (
        <div className="mb-4">
          <CollapsibleTableFilters
            activeCount={activeCount}
            onClear={handleClear}
          >
            <div className="flex flex-wrap items-end gap-3">
              <FormFieldFrame
                label={LABELS.search ?? "Search"}
                htmlFor="wallet-liability-search"
                className="w-64"
              >
                <Input
                  id="wallet-liability-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer name or email..."
                />
              </FormFieldFrame>
            </div>
          </CollapsibleTableFilters>
        </div>
      )}

      <DataTable
        ariaLabel={LABELS.walletLiabilityTableAria}
        columns={COLUMNS}
        rows={filteredRows}
        getRowId={(row, index) => row.userId ?? String(index)}
        loading={loading}
        emptyMessage={LABELS.noReportData}
        rowDetails={false}
        pagination={pagination}
      />
    </div>
  );
}
