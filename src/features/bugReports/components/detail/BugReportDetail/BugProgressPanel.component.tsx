import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { BUG_REPORT_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { BugReport } from "../../../api/list/bugReports.api";
import { BUG_STATUS_LABEL } from "../../../utils/detail/labels";
import { ProgressTrack } from "./BugProgressTrack.component";
import type { ProgressStep } from "../../../utils/detail/bugReportDetailShared";
import { bugReportPanelsStyles } from "../../../styles/detail/bugReportPanels.styles";

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
    <section className={bugReportPanelsStyles.panelRootWithBar}>
      <div aria-hidden className={bugReportPanelsStyles.panelAccentBar} />
      <div className={bugReportPanelsStyles.panelHeader}>
        <TextEyebrow brand>{LABELS.bugProgress}</TextEyebrow>
        <p className={bugReportPanelsStyles.panelSubtitleSmall}>
          {LABELS.bugProgressHint}
        </p>
      </div>
      <div className={bugReportPanelsStyles.panelBodyRelaxed}>
        <ProgressTrack steps={progress} />
        <div className={bugReportPanelsStyles.panelSectionDividerLarge}>
          <TextEyebrow>{LABELS.bugTimeline}</TextEyebrow>
          <dl className={bugReportPanelsStyles.timelineList}>
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
            <div className={bugReportPanelsStyles.timelineRow}>
              <dt className={bugReportPanelsStyles.timelineLabel}>
                {LABELS.bugTimelineCurrent}
              </dt>
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
          <div className={bugReportPanelsStyles.panelVerifyBox}>
            <p className={bugReportPanelsStyles.panelVerifyText}>
              {LABELS.bugVerifyHint}
            </p>
            <Button
              type="button"
              className={bugReportPanelsStyles.panelVerifyBtn}
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
    <div className={bugReportPanelsStyles.timelineRow}>
      <dt className={bugReportPanelsStyles.timelineLabel}>{label}</dt>
      <dd className={bugReportPanelsStyles.timelineValue}>
        {formatOrderDate(date)}
      </dd>
    </div>
  );
}
