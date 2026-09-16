import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { ReportExportButtons, type ExportFileFormat } from "@/features/reports";
import { TableScrollShell } from "@/shared/components/DataTable/TableScrollShell.component";
import type { VendorSettlementRow } from "../../../api/finance/reports.api";
import { adminSettlementReportsPanelStyles } from "../../../styles/finance/adminSettlementReportsPanel.styles";

interface VendorSettlementsTableProps {
  vendors: VendorSettlementRow[];
  controlsDisabled: boolean;
  exportingFormat?: ExportFileFormat | null;
  message: string | null;
  onExport: (format: ExportFileFormat) => void;
}

export function VendorSettlementsTable({
  vendors,
  controlsDisabled,
  exportingFormat,
  message,
  onExport,
}: VendorSettlementsTableProps) {
  return (
    <div className={adminSettlementReportsPanelStyles.vendorsContainer}>
      <div className={adminSettlementReportsPanelStyles.vendorsHeader}>
        <div className={adminSettlementReportsPanelStyles.vendorsHeaderLeft}>
          <h3 className={adminSettlementReportsPanelStyles.vendorsTitle}>
            {LABELS.vendorSettlements}
          </h3>
          <span className={adminSettlementReportsPanelStyles.vendorsCountBadge}>
            {vendors.length}
          </span>
        </div>
        <ReportExportButtons
          size="sm"
          controlsDisabled={controlsDisabled}
          exportingFormat={exportingFormat}
          statusMessage={message}
          onExportExcel={() => onExport("xlsx")}
          onExportCsv={() => onExport("csv")}
          onExportPdf={() => onExport("pdf")}
        />
      </div>
      <TableScrollShell>
        <table className={adminSettlementReportsPanelStyles.table}>
          <thead className={adminSettlementReportsPanelStyles.thead}>
            <tr>
              <th className={adminSettlementReportsPanelStyles.th}>
                {LABELS.vendorName}
              </th>
              <th className={adminSettlementReportsPanelStyles.th}>
                {LABELS.pendingNet}
              </th>
              <th className={adminSettlementReportsPanelStyles.th}>
                {LABELS.settledNet}
              </th>
              <th className={adminSettlementReportsPanelStyles.th}>
                {LABELS.payoutAmount}
              </th>
              <th className={adminSettlementReportsPanelStyles.th}>
                {LABELS.payoutPaid}
              </th>
              <th className={adminSettlementReportsPanelStyles.th}>
                {LABELS.payoutStatus}
              </th>
            </tr>
          </thead>
          <tbody className={adminSettlementReportsPanelStyles.tbody}>
            {vendors.map((row) => (
              <tr
                key={row.vendorId}
                className={adminSettlementReportsPanelStyles.tr}
              >
                <td className={adminSettlementReportsPanelStyles.cellName}>
                  {row.vendorName}
                </td>
                <td className={adminSettlementReportsPanelStyles.cellNum}>
                  {formatInr(row.pendingNet)}
                </td>
                <td className={adminSettlementReportsPanelStyles.cellNum}>
                  {formatInr(row.settledNet)}
                </td>
                <td className={adminSettlementReportsPanelStyles.cellNum}>
                  {formatInr(row.payoutAmount)}
                </td>
                <td className={adminSettlementReportsPanelStyles.cellNum}>
                  {formatInr(row.payoutPaid)}
                </td>
                <td className={adminSettlementReportsPanelStyles.cellBadge}>
                  <span className={adminSettlementReportsPanelStyles.badge}>
                    {row.payoutStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScrollShell>
    </div>
  );
}
