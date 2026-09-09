import { useMemo } from "react";
import { type DataTableColumn } from "@/shared/components/DataTable.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import {
  BUG_MODULE_LABEL,
  BUG_SEVERITY_LABEL,
  BUG_STATUS_LABEL,
} from "../../utils/detail/labels";
import type { BugReport } from "../../api/list/bugReports.api";
import { bugReportListStyles } from "../../styles/list/bugReportList.styles";

interface UseBugReportTableColumnsParams {
  showReporter?: boolean;
  showModule?: boolean;
  showSeverity?: boolean;
}

export function useBugReportTableColumns({
  showReporter,
  showModule,
  showSeverity,
}: UseBugReportTableColumnsParams): DataTableColumn<BugReport>[] {
  return useMemo(() => {
    const cols: DataTableColumn<BugReport>[] = [
      {
        id: "reportNumber",
        header: LABELS.bugReportNumber,
        cell: (row) => (
          <span className={bugReportListStyles.reportNumberCell}>
            {row.reportNumber}
          </span>
        ),
        className: bugReportListStyles.reportNumberCol,
      },
      {
        id: "title",
        header: LABELS.bugTitle,
        cell: (row) => (
          <span className={bugReportListStyles.titleCell}>{row.title}</span>
        ),
      },
    ];

    if (showReporter) {
      cols.push({
        id: "reporterName",
        header: LABELS.bugReporter,
        cell: (row: BugReport) => row.reporterName || LABELS.emptyCell,
        hideOnMobile: true,
      });
    }

    if (showModule) {
      cols.push({
        id: "affectedModule",
        header: LABELS.bugAffectedModule,
        cell: (row: BugReport) => BUG_MODULE_LABEL[row.affectedModule],
        hideOnMobile: true,
      });
    }

    if (showSeverity) {
      cols.push({
        id: "severity",
        header: LABELS.bugSeverity,
        cell: (row: BugReport) => (
          <StatusBadge
            status={row.severity ?? "NONE"}
            label={
              row.severity
                ? BUG_SEVERITY_LABEL[row.severity]
                : LABELS.bugSeverityNone
            }
          />
        ),
      });
    }

    cols.push(
      {
        id: "status",
        header: LABELS.status,
        cell: (row) => (
          <StatusBadge
            status={row.status}
            label={BUG_STATUS_LABEL[row.status]}
          />
        ),
      },
      {
        id: "createdAt",
        header: LABELS.createdAt,
        cell: (row) => formatOrderDate(row.createdAt),
        hideOnMobile: true,
      },
    );

    return cols;
  }, [showReporter, showModule, showSeverity]);
}
