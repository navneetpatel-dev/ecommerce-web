import Link from "next/link";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { BUG_REPORT_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { BUG_SEVERITY_LABEL, BUG_STATUS_LABEL } from "../../utils/detail/labels";
import type { BugReport } from "../../api/list/bugReports.api";
import { bugReportCardListStyles } from "./bugReportCardList.styles";

interface BugReportCardItemProps {
  report: BugReport;
  href: string;
}

export function BugReportCardItem({ report, href }: BugReportCardItemProps) {
  return (
    <li className={bugReportCardListStyles.itemWrapper}>
      <Link href={href} className={bugReportCardListStyles.card}>
        <div className={bugReportCardListStyles.cardContent}>
          <div className={bugReportCardListStyles.badgesRow}>
            <span className={bugReportCardListStyles.reportNumber}>
              {report.reportNumber}
            </span>
            <StatusBadge
              status={report.status}
              label={BUG_STATUS_LABEL[report.status]}
            />
            {report.severity ? (
              <StatusBadge
                status={report.severity}
                label={BUG_SEVERITY_LABEL[report.severity]}
              />
            ) : report.status !== BUG_REPORT_STATUS.NEW ? (
              <StatusBadge status="NONE" label={LABELS.bugSeverityNone} />
            ) : null}
          </div>
          <p className={bugReportCardListStyles.title}>{report.title}</p>
          <p className={bugReportCardListStyles.description}>
            {report.description}
          </p>
          <p className={bugReportCardListStyles.meta}>
            {formatOrderDate(report.createdAt)}
          </p>
        </div>
      </Link>
    </li>
  );
}
