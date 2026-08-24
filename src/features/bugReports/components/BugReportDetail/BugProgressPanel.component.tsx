import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { BUG_REPORT_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import type { BugReport } from "../../api/bugReports.api";
import { BUG_STATUS_LABEL } from "../../utils/labels";
import { ProgressTrack } from "./BugProgressTrack.component";
import type { ProgressStep } from "./bugReportDetailShared";

interface BugProgressPanelProps {
  report: BugReport;
  mode: "reporter" | "admin";
  progress: ProgressStep[];
  verifyPending: boolean;
  actionError: string | null;
  onVerify: () => void;
}

/** Progress track, timeline rows and the reporter verify-fixed callout. */
export function BugProgressPanel(props: BugProgressPanelProps) {
  const { report, mode, progress } = props;

  return (
    <section className="relative overflow-hidden border border-line bg-surface shadow-elevation-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent"
      />
      <div className="border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5">
        <TextEyebrow brand>{LABELS.bugProgress}</TextEyebrow>
        <p className="mt-1 text-[0.75rem] text-ink-muted sm:text-body-sm">
          {LABELS.bugProgressHint}
        </p>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <ProgressTrack steps={progress} />
        <div className="mt-5 border-t border-line/60 pt-4">
          <TextEyebrow>{LABELS.bugTimeline}</TextEyebrow>
          <dl className="mt-3 space-y-2.5 text-body-sm">
            <TimelineRow
              label={LABELS.bugTimelineFiled}
              date={report.createdAt}
            />
            {report.triagedAt ? (
              <TimelineRow
                label={LABELS.bugTimelineTriaged}
                date={report.triagedAt}
              />
            ) : null}
            {report.inProgressAt ? (
              <TimelineRow
                label={LABELS.bugTimelineInProgress}
                date={report.inProgressAt}
              />
            ) : null}
            {report.resolvedAt ? (
              <TimelineRow
                label={LABELS.bugTimelineResolved}
                date={report.resolvedAt}
              />
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-muted">{LABELS.bugTimelineCurrent}</dt>
              <dd>
                <StatusBadge
                  status={report.status}
                  label={BUG_STATUS_LABEL[report.status]}
                />
              </dd>
            </div>
          </dl>
        </div>
        {mode === "reporter" && report.status === BUG_REPORT_STATUS.FIXED ? (
          <div className="mt-4 border border-brand/30 bg-brand-subtle/50 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-[0.875rem] text-ink">{LABELS.bugVerifyHint}</p>
            <Button
              type="button"
              className="mt-3"
              loading={props.verifyPending}
              onClick={props.onVerify}
            >
              {LABELS.bugVerifyFixed}
            </Button>
            {props.actionError ? (
              <FormError
                error={new Error(props.actionError)}
                fallback={LABELS.bugCouldNotUpdate}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TimelineRow({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink">{formatOrderDate(date)}</dd>
    </div>
  );
}
