import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { BUG_REPORTER_ROLE_LABEL } from "../../utils/labels";
import type { BugReport } from "../../api/bugReports.api";
import { ContextRow } from "./BugAttachmentGrid";

/** Device/browser context panel — full set for admins, short set for reporters. */
export function BugContextPanel({
  report,
  mode,
}: {
  report: BugReport;
  mode: "reporter" | "admin";
}) {
  const appVersionDisplay = report.appVersion || LABELS.emptyCell;

  if (mode === "admin") {
    return (
      <section className="relative overflow-hidden border border-line bg-surface shadow-elevation-1">
        <PanelHeader label={LABELS.bugContextPanel} />
        <dl className="grid gap-3.5 px-4 py-4 sm:px-5">
          <ContextRow
            label={LABELS.bugPageUrl}
            value={report.pageUrl || LABELS.emptyCell}
            mono
          />
          <ContextRow
            label={LABELS.bugBrowser}
            value={report.browserName || LABELS.emptyCell}
          />
          <ContextRow
            label={LABELS.bugOs}
            value={report.osName || LABELS.emptyCell}
          />
          <ContextRow
            label={LABELS.bugDevice}
            value={report.deviceType || LABELS.emptyCell}
          />
          <ContextRow label={LABELS.bugAppVersion} value={appVersionDisplay} />
          <ContextRow
            label={LABELS.bugUserAgent}
            value={report.userAgent || LABELS.emptyCell}
            mono
          />
          <ContextRow
            label={LABELS.bugOccurredAt}
            value={
              report.occurredAt
                ? formatOrderDate(report.occurredAt)
                : LABELS.emptyCell
            }
          />
          <ContextRow
            label={LABELS.bugReporterRoleLabel}
            value={
              report.reporterRole
                ? BUG_REPORTER_ROLE_LABEL[report.reporterRole]
                : LABELS.emptyCell
            }
          />
          <ContextRow
            label={LABELS.bugReporterUserId}
            value={report.userId || LABELS.emptyCell}
            mono
          />
          <ContextRow
            label={LABELS.bugReporterUserRole}
            value={report.userRole || LABELS.emptyCell}
          />
        </dl>
      </section>
    );
  }

  return (
    <section className="overflow-hidden border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5">
        <TextEyebrow brand>{LABELS.bugContextPanel}</TextEyebrow>
      </div>
      <dl className="grid gap-3.5 px-4 py-4 sm:px-5">
        <ContextRow
          label={LABELS.bugPageUrl}
          value={report.pageUrl || LABELS.emptyCell}
          mono
        />
        <ContextRow
          label={LABELS.bugBrowser}
          value={report.browserName || LABELS.emptyCell}
        />
        <ContextRow
          label={LABELS.bugOs}
          value={report.osName || LABELS.emptyCell}
        />
        <ContextRow
          label={LABELS.bugDevice}
          value={report.deviceType || LABELS.emptyCell}
        />
        <ContextRow label={LABELS.bugAppVersion} value={appVersionDisplay} />
      </dl>
    </section>
  );
}

function PanelHeader({ label }: { label: string }) {
  return (
    <div className="border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5">
      <TextEyebrow brand>{label}</TextEyebrow>
    </div>
  );
}
