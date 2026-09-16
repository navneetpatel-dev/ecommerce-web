import { LABELS } from "@/shared/constants/labels";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { PaginationResultSummary } from "@/shared/components/PaginationResultSummary.component";
import { TableScrollShell } from "@/shared/components/DataTable/TableScrollShell.component";
import type { WalletLiabilityReport } from "../../../api/finance/reports.api";
import { adminWalletLiabilityPanelStyles } from "../../../styles/wallet/adminWalletLiabilityPanel.styles";

interface LiabilityRowsTableProps {
  report: WalletLiabilityReport;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function LiabilityRowsTable({
  report,
  page,
  loading,
  onPageChange,
}: LiabilityRowsTableProps) {
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
        <div className={adminWalletLiabilityPanelStyles.tableContainer}>
          <TableScrollShell>
            <table className={adminWalletLiabilityPanelStyles.table}>
              <thead className={adminWalletLiabilityPanelStyles.thead}>
                <tr>
                  <th className={adminWalletLiabilityPanelStyles.th}>
                    {LABELS.reportUserId}
                  </th>
                  <th className={adminWalletLiabilityPanelStyles.th}>
                    {LABELS.reportBalance}
                  </th>
                  <th className={adminWalletLiabilityPanelStyles.th}>
                    {LABELS.reportPurchasedPoints}
                  </th>
                  <th className={adminWalletLiabilityPanelStyles.th}>
                    {LABELS.reportPromotionalPoints}
                  </th>
                  <th className={adminWalletLiabilityPanelStyles.th}>
                    {LABELS.reportAsOf}
                  </th>
                </tr>
              </thead>
              <tbody className={adminWalletLiabilityPanelStyles.tbody}>
                {report.rows.map((row) => (
                  <tr
                    key={row.userId}
                    className={adminWalletLiabilityPanelStyles.tr}
                  >
                    <td className={adminWalletLiabilityPanelStyles.cellMono}>
                      {row.userId}
                    </td>
                    <td className={adminWalletLiabilityPanelStyles.cellNumBold}>
                      {formatPoints(row.balance)}
                    </td>
                    <td className={adminWalletLiabilityPanelStyles.cellNum}>
                      {formatPoints(row.purchasedPoints ?? 0)}
                    </td>
                    <td className={adminWalletLiabilityPanelStyles.cellNum}>
                      {formatPoints(row.promotionalPoints ?? 0)}
                    </td>
                    <td className={adminWalletLiabilityPanelStyles.cellMuted}>
                      {new Date(row.asOf).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScrollShell>
        </div>
      ) : (
        <div className={adminWalletLiabilityPanelStyles.tableEmpty}>
          <p className={adminWalletLiabilityPanelStyles.tableEmptyText}>
            {LABELS.noReportData}
          </p>
        </div>
      )}

      {report.pagination ? (
        <div
          className={
            loading
              ? adminWalletLiabilityPanelStyles.paginationLoading
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
