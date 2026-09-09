import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { BugReport } from "../../../api/list/bugReports.api";
import {
  BUG_MODULE_LABEL,
  BUG_SEVERITY_LABEL,
  BUG_STATUS_LABEL,
} from "../../../utils/detail/labels";
import { bugListHref } from "../../../utils/detail/bugReportDetailShared";
import { bugReportDetailStyles } from "../../../styles/detail/bugReportDetail.styles";

/** Back link, title, reporter meta and status/severity/module badges. */
export function BugReportHeader({
  report,
  mode,
  backHref,
}: {
  report: BugReport;
  mode: "reporter" | "admin";
  backHref?: string;
}) {
  const listHref = bugListHref(mode, backHref);

  return (
    <header className={bugReportDetailStyles.header}>
      <div className={bugReportDetailStyles.navRow}>
        <Link href={listHref} className={bugReportDetailStyles.backLink}>
          <ArrowLeft
            className={bugReportDetailStyles.backIcon}
            strokeWidth={1.5}
          />
          {LABELS.bugBackToList}
        </Link>
        <span className={bugReportDetailStyles.reportNumber}>
          {report.reportNumber}
        </span>
      </div>

      <div className={bugReportDetailStyles.titleRow}>
        <div className={bugReportDetailStyles.titleWrap}>
          <h1 className={bugReportDetailStyles.title}>{report.title}</h1>
          <p className={bugReportDetailStyles.subtitle}>
            {LABELS.bugFiledOn} {formatOrderDate(report.createdAt)}
            {report.reporterName ? ` · ${report.reporterName}` : ""}
            {mode === "admin" && report.assignedToName
              ? ` · ${report.assignedToName}`
              : null}
          </p>
        </div>
        <div className={bugReportDetailStyles.badgesWrap}>
          <StatusBadge
            status={report.status}
            label={BUG_STATUS_LABEL[report.status]}
          />
          {mode === "admin" ? (
            <>
              <StatusBadge
                status={report.severity ?? "NONE"}
                label={
                  report.severity
                    ? BUG_SEVERITY_LABEL[report.severity]
                    : LABELS.bugSeverityNone
                }
              />
              <StatusBadge
                status={report.affectedModule}
                label={BUG_MODULE_LABEL[report.affectedModule]}
              />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
