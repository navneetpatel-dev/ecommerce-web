import { useState, useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { ReportExportButtons, type ExportFileFormat } from "@/features/reports";
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
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import type { VendorSettlementRow } from "../../../api/finance/reports.api";
import { adminSettlementReportsPanelStyles as styles } from "../../../styles/finance/adminSettlementReportsPanel.styles";

interface VendorSettlementsTableProps {
  vendors: VendorSettlementRow[];
  controlsDisabled: boolean;
  exportingFormat?: ExportFileFormat | null;
  message: string | null;
  onExport: (format: ExportFileFormat) => void;
}

const COLUMNS: DataTableColumn<VendorSettlementRow>[] = [
  {
    id: "vendorName",
    header: LABELS.vendorName,
    className: styles.cellName,
    accessor: "vendorName",
  },
  {
    id: "pendingNet",
    header: LABELS.pendingNet,
    className: styles.cellNum,
    cell: (row) => formatInr(row.pendingNet),
  },
  {
    id: "settledNet",
    header: LABELS.settledNet,
    className: styles.cellNum,
    cell: (row) => formatInr(row.settledNet),
  },
  {
    id: "payoutAmount",
    header: LABELS.payoutAmount,
    className: styles.cellNum,
    cell: (row) => formatInr(row.payoutAmount),
  },
  {
    id: "payoutPaid",
    header: LABELS.payoutPaid,
    className: styles.cellNum,
    cell: (row) => formatInr(row.payoutPaid),
  },
  {
    id: "payoutFailed",
    header: LABELS.payoutFailed,
    className: styles.cellNum,
    cell: (row) => formatInr(row.payoutFailed),
  },
  {
    id: "payoutStatus",
    header: LABELS.payoutStatus,
    truncate: false,
    cell: (row) => <span className={styles.badge}>{row.payoutStatus}</span>,
  },
];

export function VendorSettlementsTable({
  vendors,
  controlsDisabled,
  exportingFormat,
  message,
  onExport,
}: VendorSettlementsTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const handleExportExcel = () => onExport("xlsx");
  const handleExportCsv = () => onExport("csv");
  const handleExportPdf = () => onExport("pdf");

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesName = v.vendorName?.toLowerCase().includes(query);
        const matchesId = v.vendorId?.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }
      if (status && v.payoutStatus !== status) {
        return false;
      }
      return true;
    });
  }, [vendors, debouncedSearch, status]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(
      new Set(vendors.map((v) => v.payoutStatus).filter(Boolean)),
    );
  }, [vendors]);

  const activeCount = (search.trim() ? 1 : 0) + (status ? 1 : 0);

  const handleClear = () => {
    setSearch("");
    setStatus("");
  };

  return (
    <div className={styles.vendorsContainer}>
      <div className={styles.vendorsHeader}>
        <div className={styles.vendorsHeaderLeft}>
          <h3 className={styles.vendorsTitle}>{LABELS.vendorSettlements}</h3>
          <span className={styles.vendorsCountBadge}>
            {filteredVendors.length}
          </span>
        </div>
        <ReportExportButtons
          size="sm"
          controlsDisabled={controlsDisabled}
          exportingFormat={exportingFormat}
          statusMessage={message}
          onExportExcel={handleExportExcel}
          onExportCsv={handleExportCsv}
          onExportPdf={handleExportPdf}
        />
      </div>

      <div className="mb-4">
        <CollapsibleTableFilters
          activeCount={activeCount}
          onClear={handleClear}
        >
          <div className="flex flex-wrap items-end gap-3">
            <FormFieldFrame
              label={LABELS.search ?? "Search"}
              htmlFor="vendor-settlements-search"
              className="w-64"
            >
              <Input
                id="vendor-settlements-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendor name or ID..."
              />
            </FormFieldFrame>

            {uniqueStatuses.length > 0 && (
              <FormFieldFrame
                label="Payout Status"
                htmlFor="vendor-settlements-status"
                className="w-44"
              >
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val === "ALL" ? "" : val)}
                >
                  <SelectTrigger id="vendor-settlements-status">
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

      <DataTable
        ariaLabel={LABELS.vendorSettlementsTableAria}
        columns={COLUMNS}
        rows={filteredVendors}
        getRowId={(row) => row.vendorId}
        rowDetails
        showViewButton
        emptyMessage={LABELS.noReportData}
      />
    </div>
  );
}
