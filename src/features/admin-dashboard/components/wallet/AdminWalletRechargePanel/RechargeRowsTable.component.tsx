import { useState, useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import type { WalletRechargeReport } from "../../../api/finance/reports.api";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import { adminWalletRechargePanelStyles as styles } from "../../../styles/wallet/adminWalletRechargePanel.styles";

type RechargeRow = WalletRechargeReport["rows"][number];

interface RechargeRowsTableProps {
  report: WalletRechargeReport;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const COLUMNS: DataTableColumn<RechargeRow>[] = [
  {
    id: "customer",
    header: LABELS.customerName,
    className: styles.cellMuted,
    cell: (row) => row.customerName || row.customerEmail || LABELS.customerName,
  },
  {
    id: "amountInr",
    header: LABELS.reportAmountInr,
    className: styles.cellNumBold,
    cell: (row) => formatInr(row.amountInr),
  },
  {
    id: "pointsCredited",
    header: LABELS.reportPointsCredited,
    className: styles.cellNum,
    cell: (row) => formatPoints(row.pointsCredited),
  },
  {
    id: "status",
    header: LABELS.reportStatus,
    truncate: false,
    cell: (row) => <span className={styles.badge}>{row.status}</span>,
  },
  {
    id: "paidAt",
    header: LABELS.reportPaidAt,
    className: styles.cellMuted,
    cell: (row) => (row.paidAt ? formatDate(row.paidAt) : "—"),
  },
];

export function RechargeRowsTable({
  report,
  page,
  loading,
  onPageChange,
}: RechargeRowsTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filteredRows = useMemo(() => {
    return report.rows.filter((row) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesName = row.customerName?.toLowerCase().includes(q);
        const matchesEmail = row.customerEmail?.toLowerCase().includes(q);
        const matchesId = row.id?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesId) return false;
      }
      if (status && row.status !== status) return false;
      return true;
    });
  }, [report.rows, search, status]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(
      new Set(report.rows.map((r) => r.status).filter(Boolean)),
    );
  }, [report.rows]);

  const activeCount = (search.trim() ? 1 : 0) + (status ? 1 : 0);

  const handleClear = () => {
    setSearch("");
    setStatus("");
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
                htmlFor="wallet-recharge-search"
                className="w-64"
              >
                <Input
                  id="wallet-recharge-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer name or email..."
                />
              </FormFieldFrame>

              {uniqueStatuses.length > 0 && (
                <FormFieldFrame
                  label="Status"
                  htmlFor="wallet-recharge-status"
                  className="w-40"
                >
                  <Select
                    value={status}
                    onValueChange={(val) => setStatus(val === "ALL" ? "" : val)}
                  >
                    <SelectTrigger id="wallet-recharge-status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All statuses</SelectItem>
                      {uniqueStatuses.map((st) => (
                        <SelectItem key={st} value={st}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormFieldFrame>
              )}
            </div>
          </CollapsibleTableFilters>
        </div>
      )}

      <DataTable
        ariaLabel={LABELS.walletRechargeTableAria}
        columns={COLUMNS}
        rows={filteredRows}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage={LABELS.noReportData}
        rowDetails
        showViewButton
        pagination={pagination}
      />
    </div>
  );
}
