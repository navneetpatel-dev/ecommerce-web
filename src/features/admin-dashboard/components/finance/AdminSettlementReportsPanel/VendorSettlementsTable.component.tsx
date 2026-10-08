import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { ReportExportButtons, type ExportFileFormat } from "@/features/reports";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
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
  const handleExportExcel = () => onExport("xlsx");
  const handleExportCsv = () => onExport("csv");
  const handleExportPdf = () => onExport("pdf");

  return (
    <div className={styles.vendorsContainer}>
      <div className={styles.vendorsHeader}>
        <div className={styles.vendorsHeaderLeft}>
          <h3 className={styles.vendorsTitle}>{LABELS.vendorSettlements}</h3>
          <span className={styles.vendorsCountBadge}>{vendors.length}</span>
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
      <DataTable
        ariaLabel={LABELS.vendorSettlementsTableAria}

        columns={COLUMNS}
        rows={vendors}
        getRowId={(row) => row.vendorId}
        rowDetails={false}
        emptyMessage={LABELS.noReportData}
      />
    </div>
  );
}
