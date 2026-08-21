import Link from "next/link";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { LABELS } from "@/shared/constants/labels";
import { BUG_REPORT_STATUS } from "@/shared/constants/statuses";
import type { BugReport } from "../../api/bugReports.api";
import { AttachmentGrid } from "./BugAttachmentGrid";

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
    <section className="relative overflow-hidden border border-line bg-surface shadow-elevation-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent"
      />
      <div className="border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5">
        <TextEyebrow brand>{LABELS.bugDescription}</TextEyebrow>
      </div>
      <div className="space-y-5 px-4 py-4 sm:px-5 sm:py-5">
        <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
          {report.description}
        </p>

        {report.stepsToReproduce ? (
          <div className="border-t border-line/60 pt-4">
            <TextEyebrow>{LABELS.bugStepsToReproduce}</TextEyebrow>
            <p className="mt-2 whitespace-pre-wrap text-[0.875rem] leading-relaxed text-ink-muted">
              {report.stepsToReproduce}
            </p>
          </div>
        ) : null}

        {report.attachments?.length ? (
          <div className="border-t border-line/60 pt-4">
            <TextEyebrow>{LABELS.bugAttachmentsHeading}</TextEyebrow>
            <AttachmentGrid attachments={report.attachments} />
          </div>
        ) : null}

        {report.wontFixReason ? (
          <p className="border border-line bg-paper/50 px-3 py-2.5 text-[0.875rem] text-ink-muted sm:px-4 sm:py-3">
            <span className="font-medium text-ink">
              {LABELS.bugWontFixReason}:{" "}
            </span>
            {report.wontFixReason}
          </p>
        ) : null}

        {report.status === BUG_REPORT_STATUS.DUPLICATE &&
        report.duplicateOfId ? (
          <p className="border border-line bg-paper/50 px-3 py-2.5 text-[0.875rem] text-ink-muted sm:px-4 sm:py-3">
            <span className="font-medium text-ink">
              {LABELS.bugDuplicateOf}:{" "}
            </span>
            {mode === "admin" && duplicateOfHref ? (
              <Link
                href={duplicateOfHref}
                className="font-mono text-[0.8125rem] text-brand hover:underline"
              >
                #
                {report.duplicateOfReportNumber ??
                  report.duplicateOfId.slice(0, 8)}
              </Link>
            ) : (
              <span className="font-mono text-[0.8125rem] text-ink">
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
