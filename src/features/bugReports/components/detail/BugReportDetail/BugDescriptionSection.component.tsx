import Link from "next/link";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { BUG_REPORT_STATUS } from "@/shared/constants/statuses";
import type { BugReport } from "../../../api/list/bugReports.api";
import { AttachmentGrid } from "./BugAttachmentGrid.component";
import { bugReportDetailStyles } from "./bugReportDetail.styles";

/** Description card: description, steps, attachments, wont-fix/duplicate notes. */
export function BugDescriptionSection({
  report,
  mode,
  duplicateOfHref,
}: {
  report: BugReport;
  mode: "reporter" | "admin";
  duplicateOfHref: string | null;
}) {
  return (
    <section className={bugReportDetailStyles.panelRootWithBar}>
      <div aria-hidden className={bugReportDetailStyles.panelAccentBar} />
      <div className={bugReportDetailStyles.descHeader}>
        <TextEyebrow brand>{LABELS.bugDescription}</TextEyebrow>
      </div>
      <div className={bugReportDetailStyles.descContent}>
        <p className={bugReportDetailStyles.descText}>{report.description}</p>

        {report.stepsToReproduce ? (
          <div className={bugReportDetailStyles.descSectionDivider}>
            <TextEyebrow>{LABELS.bugStepsToReproduce}</TextEyebrow>
            <p className={bugReportDetailStyles.descStepsText}>
              {report.stepsToReproduce}
            </p>
          </div>
        ) : null}

        {report.attachments?.length ? (
          <div className={bugReportDetailStyles.descSectionDivider}>
            <TextEyebrow>{LABELS.bugAttachmentsHeading}</TextEyebrow>
            <AttachmentGrid attachments={report.attachments} />
          </div>
        ) : null}

        {report.wontFixReason ? (
          <p className={bugReportDetailStyles.descInfoBox}>
            <span className={bugReportDetailStyles.descInfoLabel}>
              {LABELS.bugWontFixReason}:{" "}
            </span>
            {report.wontFixReason}
          </p>
        ) : null}

        {report.status === BUG_REPORT_STATUS.DUPLICATE &&
        report.duplicateOfId ? (
          <p className={bugReportDetailStyles.descInfoBox}>
            <span className={bugReportDetailStyles.descInfoLabel}>
              {LABELS.bugDuplicateOf}:{" "}
            </span>
            {mode === "admin" && duplicateOfHref ? (
              <Link
                href={duplicateOfHref}
                className={bugReportDetailStyles.descLinkMono}
              >
                #
                {report.duplicateOfReportNumber ??
                  report.duplicateOfId.slice(0, 8)}
              </Link>
            ) : (
              <span className={bugReportDetailStyles.descTextMono}>
                #
                {report.duplicateOfReportNumber ??
                  report.duplicateOfId.slice(0, 8)}
              </span>
            )}
          </p>
        ) : null}
      </div>
    </section>
  );
}
