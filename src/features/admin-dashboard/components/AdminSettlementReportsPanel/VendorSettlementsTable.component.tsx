import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { ReportExportButtons, type ExportFileFormat } from "@/features/reports";
import type { VendorSettlementRow } from "../../api/reports.api";

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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-body font-semibold text-ink">
            {LABELS.vendorSettlements}
          </h3>
          <span className="rounded-full bg-paper px-2 py-0.5 text-body-xs text-ink-muted border border-line">
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
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="min-w-full text-left text-[0.875rem]">
          <thead className="border-b border-line bg-paper/70 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{LABELS.vendorName}</th>
              <th className="px-4 py-3 font-medium">{LABELS.pendingNet}</th>
              <th className="px-4 py-3 font-medium">{LABELS.settledNet}</th>
              <th className="px-4 py-3 font-medium">{LABELS.payoutAmount}</th>
              <th className="px-4 py-3 font-medium">{LABELS.payoutPaid}</th>
              <th className="px-4 py-3 font-medium">{LABELS.payoutStatus}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {vendors.map((row) => (
              <tr
                key={row.vendorId}
                className="transition-colors hover:bg-paper/40"
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {row.vendorName}
                </td>
                <td className="px-4 py-3 tabular-nums text-ink">
                  {formatInr(row.pendingNet)}
                </td>
                <td className="px-4 py-3 tabular-nums text-ink">
                  {formatInr(row.settledNet)}
                </td>
                <td className="px-4 py-3 tabular-nums text-ink">
                  {formatInr(row.payoutAmount)}
                </td>
                <td className="px-4 py-3 tabular-nums text-ink">
                  {formatInr(row.payoutPaid)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-body-xs font-medium text-ink border border-line">
                    {row.payoutStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
