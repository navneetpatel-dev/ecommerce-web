import { LABELS } from "@/shared/constants/labels";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import type { WalletLiabilityReport } from "../../../api/finance/reports.api";
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
    id: "userId",
    header: LABELS.reportUserId,
    className: styles.cellMono,
    accessor: "userId",
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
    cell: (row) => new Date(row.asOf).toLocaleDateString("en-IN"),
  },
];

export function LiabilityRowsTable({
  report,
  page,
  loading,
  onPageChange,
}: LiabilityRowsTableProps) {
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
      getRowId={(row) => row.userId}
      loading={loading}
      emptyMessage={LABELS.noReportData}
      rowDetails={false}
      pagination={pagination}
    />
  );
}
