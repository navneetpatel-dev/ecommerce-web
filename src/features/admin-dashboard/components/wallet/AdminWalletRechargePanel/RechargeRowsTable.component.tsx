import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import type { WalletRechargeReport } from "../../../api/finance/reports.api";
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
    id: "userId",
    header: LABELS.reportUserId,
    className: styles.cellMono,
    accessor: "userId",
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
    cell: (row) =>
      row.paidAt ? new Date(row.paidAt).toLocaleDateString("en-IN") : "—",
  },
];

export function RechargeRowsTable({
  report,
  page,
  loading,
  onPageChange,
}: RechargeRowsTableProps) {
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
    <DataTable
      columns={COLUMNS}
      rows={report.rows}
      getRowId={(row) => row.id}
      loading={loading}
      emptyMessage={LABELS.noReportData}
      rowDetails={false}
      pagination={pagination}
    />
  );
}
