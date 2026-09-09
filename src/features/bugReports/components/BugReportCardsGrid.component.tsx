import type { BugReport } from "../api/bugReports.api";
import { bugReportCardListStyles } from "./bugReportCardList.styles";
import { BugReportCardItem } from "./BugReportCardItem.component";

interface BugReportCardsGridProps {
  reports: BugReport[];
  detailHref: (id: string) => string;
}

export function BugReportCardsGrid({
  reports,
  detailHref,
}: BugReportCardsGridProps) {
  return (
    <ul className={bugReportCardListStyles.grid}>
      {reports.map((report) => (
        <BugReportCardItem
          key={report.id}
          report={report}
          href={detailHref(report.id)}
        />
      ))}
    </ul>
  );
}
