import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";
import { PaginationContainer } from "@/shared/containers/PaginationContainer.container";
import { PaginationResultSummary } from "@/shared/components/PaginationResultSummary.component";
import type { WalletRechargeReport } from "../../api/reports.api";

interface RechargeRowsTableProps {
  report: WalletRechargeReport;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function RechargeRowsTable({
  report,
  page,
  loading,
  onPageChange,
}: RechargeRowsTableProps) {
  return (
    <>
      {report.pagination ? (
        <PaginationResultSummary
          from={
            report.pagination.total > 0
              ? (page - 1) * report.pagination.limit + 1
              : 0
          }
          to={Math.min(page * report.pagination.limit, report.pagination.total)}
          total={report.pagination.total}
        />
      ) : null}

      {report.rows.length > 0 ? (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="min-w-full text-left text-[0.875rem]">
              <thead className="border-b border-line bg-paper/70 text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportUserId}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportAmountInr}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportPointsCredited}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportStatus}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportPaidAt}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {report.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-paper/40"
                  >
                    <td className="px-4 py-3 font-mono text-body-sm text-ink">
                      {row.userId}
                    </td>
                    <td className="px-4 py-3 tabular-nums font-medium text-ink">
                      {formatInr(row.amountInr)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink">
                      {formatPoints(row.pointsCredited)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-body-xs font-medium text-ink border border-line">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {row.paidAt
                        ? new Date(row.paidAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper/30 py-8 px-4 text-center">
          <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
        </div>
      )}

      {report.pagination ? (
        <div className={loading ? "pointer-events-none opacity-60" : undefined}>
          <PaginationContainer
            currentPage={page}
            totalPages={Math.max(1, report.pagination.totalPages)}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </>
  );
}
