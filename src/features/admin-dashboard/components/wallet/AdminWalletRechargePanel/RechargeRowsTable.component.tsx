import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { PaginationResultSummary } from "@/shared/components/PaginationResultSummary.component";
import { TableScrollShell } from "@/shared/components/DataTable/TableScrollShell.component";
import type { WalletRechargeReport } from "../../../api/finance/reports.api";
import { adminWalletRechargePanelStyles } from "../../../styles/wallet/adminWalletRechargePanel.styles";

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
        <div className={adminWalletRechargePanelStyles.tableContainer}>
          <TableScrollShell>
            <table className={adminWalletRechargePanelStyles.table}>
              <thead className={adminWalletRechargePanelStyles.thead}>
                <tr>
                  <th className={adminWalletRechargePanelStyles.th}>
                    {LABELS.reportUserId}
                  </th>
                  <th className={adminWalletRechargePanelStyles.th}>
                    {LABELS.reportAmountInr}
                  </th>
                  <th className={adminWalletRechargePanelStyles.th}>
                    {LABELS.reportPointsCredited}
                  </th>
                  <th className={adminWalletRechargePanelStyles.th}>
                    {LABELS.reportStatus}
                  </th>
                  <th className={adminWalletRechargePanelStyles.th}>
                    {LABELS.reportPaidAt}
                  </th>
                </tr>
              </thead>
              <tbody className={adminWalletRechargePanelStyles.tbody}>
                {report.rows.map((row) => (
                  <tr
                    key={row.id}
                    className={adminWalletRechargePanelStyles.tr}
                  >
                    <td className={adminWalletRechargePanelStyles.cellMono}>
                      {row.userId}
                    </td>
                    <td className={adminWalletRechargePanelStyles.cellNumBold}>
                      {formatInr(row.amountInr)}
                    </td>
                    <td className={adminWalletRechargePanelStyles.cellNum}>
                      {formatPoints(row.pointsCredited)}
                    </td>
                    <td className={adminWalletRechargePanelStyles.cellBadge}>
                      <span className={adminWalletRechargePanelStyles.badge}>
                        {row.status}
                      </span>
                    </td>
                    <td className={adminWalletRechargePanelStyles.cellMuted}>
                      {row.paidAt
                        ? new Date(row.paidAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScrollShell>
        </div>
      ) : (
        <div className={adminWalletRechargePanelStyles.tableEmpty}>
          <p className={adminWalletRechargePanelStyles.tableEmptyText}>
            {LABELS.noReportData}
          </p>
        </div>
      )}

      {report.pagination ? (
        <div
          className={
            loading
              ? adminWalletRechargePanelStyles.paginationLoading
              : undefined
          }
        >
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
