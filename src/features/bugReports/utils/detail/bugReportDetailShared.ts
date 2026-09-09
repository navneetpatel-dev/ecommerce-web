import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import {
  BUG_REPORT_STATUS,
  type BugReportStatus,
} from "@/shared/constants/statuses";
import type { BugReport, BugTimelineEntry } from "../../api/list/bugReports.api";

export type BugReportDetailProps = {
  report: BugReport;
  mode: "reporter" | "admin";
  backHref?: string;
};

export const ADMIN_STATUS_TRANSITIONS: Partial<
  Record<BugReportStatus, BugReportStatus[]>
> = {
  [BUG_REPORT_STATUS.TRIAGED]: [BUG_REPORT_STATUS.IN_PROGRESS],
  [BUG_REPORT_STATUS.IN_PROGRESS]: [BUG_REPORT_STATUS.FIXED],
  [BUG_REPORT_STATUS.FIXED]: [
    BUG_REPORT_STATUS.VERIFIED,
    BUG_REPORT_STATUS.IN_PROGRESS,
  ],
  [BUG_REPORT_STATUS.VERIFIED]: [BUG_REPORT_STATUS.CLOSED],
};

export const ASSIGNMENT_EDITABLE_STATUSES: BugReportStatus[] = [
  BUG_REPORT_STATUS.TRIAGED,
  BUG_REPORT_STATUS.IN_PROGRESS,
  BUG_REPORT_STATUS.FIXED,
];

export type ProgressStep = {
  label: string;
  status: "completed" | "current" | "upcoming";
  date?: string | null;
};

function timelineActionLabel(entry: BugTimelineEntry): string {
  switch (entry.action) {
    case "BUG_REPORT_CREATED":
      return LABELS.bugTimelineFiled;
    case "BUG_REPORT_TRIAGED":
      return LABELS.bugTimelineTriaged;
    case "BUG_REPORT_ASSIGNMENT_UPDATED":
      return LABELS.bugTimelineAssignmentUpdated;
    case "BUG_REPORT_DUPLICATE":
      return LABELS.bugTimelineDuplicate;
    case "BUG_REPORT_WONT_FIX":
      return LABELS.bugTimelineWontFix;
    case "BUG_REPORT_VERIFIED":
      return LABELS.bugTimelineVerified;
    case "BUG_REPORT_AUTO_VERIFIED":
      return LABELS.bugTimelineAutoVerified;
    case "BUG_REPORT_AUTO_CLOSED":
      return LABELS.bugTimelineAutoClosed;
    case "BUG_REPORT_STATUS": {
      const next = entry.to ?? entry.status;
      if (next === BUG_REPORT_STATUS.IN_PROGRESS)
        return LABELS.bugTimelineInProgress;
      if (next === BUG_REPORT_STATUS.FIXED) return LABELS.bugTimelineResolved;
      if (next === BUG_REPORT_STATUS.VERIFIED)
        return LABELS.bugTimelineVerified;
      if (next === BUG_REPORT_STATUS.CLOSED) return LABELS.bugStatusClosed;
      return LABELS.bugTimelineStatusChanged;
    }
    default:
      return LABELS.bugTimelineStatusChanged;
  }
}

export function statusTimeline(report: BugReport): ProgressStep[] {
  if (report.timeline?.length) {
    return report.timeline.map((entry, index) => ({
      label: timelineActionLabel(entry),
      date: String(entry.createdAt),
      status:
        index === report.timeline!.length - 1
          ? ("current" as const)
          : ("completed" as const),
    }));
  }

  const order: BugReportStatus[] = [
    BUG_REPORT_STATUS.NEW,
    BUG_REPORT_STATUS.TRIAGED,
    BUG_REPORT_STATUS.IN_PROGRESS,
    BUG_REPORT_STATUS.FIXED,
    BUG_REPORT_STATUS.VERIFIED,
  ];
  const labels: Record<string, string> = {
    [BUG_REPORT_STATUS.NEW]: LABELS.bugStatusNew,
    [BUG_REPORT_STATUS.TRIAGED]: LABELS.bugStatusTriaged,
    [BUG_REPORT_STATUS.IN_PROGRESS]: LABELS.bugStatusInProgress,
    [BUG_REPORT_STATUS.FIXED]: LABELS.bugStatusFixed,
    [BUG_REPORT_STATUS.VERIFIED]: LABELS.bugStatusVerified,
  };

  const dates: Record<string, string | null> = {
    [BUG_REPORT_STATUS.NEW]: report.createdAt,
    [BUG_REPORT_STATUS.TRIAGED]: report.triagedAt,
    [BUG_REPORT_STATUS.IN_PROGRESS]: report.inProgressAt ?? null,
    [BUG_REPORT_STATUS.FIXED]: report.resolvedAt,
    [BUG_REPORT_STATUS.VERIFIED]: report.verifiedAt ?? null,
  };

  const isTerminal =
    report.status === BUG_REPORT_STATUS.WONT_FIX ||
    report.status === BUG_REPORT_STATUS.DUPLICATE ||
    report.status === BUG_REPORT_STATUS.CLOSED;

  if (isTerminal) {
    const terminalLabels: Record<string, string> = {
      [BUG_REPORT_STATUS.WONT_FIX]: LABELS.bugStatusWontFix,
      [BUG_REPORT_STATUS.DUPLICATE]: LABELS.bugStatusDuplicate,
      [BUG_REPORT_STATUS.CLOSED]: LABELS.bugStatusClosed,
    };
    const completedSteps: ProgressStep[] = order
      .filter((s) => dates[s])
      .map((s) => ({
        label: labels[s]!,
        date: dates[s],
        status: "completed" as const,
      }));
    completedSteps.push({
      label: terminalLabels[report.status] ?? report.status,
      date: report.resolvedAt ?? report.updatedAt,
      status: "current" as const,
    });
    return completedSteps;
  }

  let currentIndex = order.indexOf(report.status);
  if (currentIndex < 0) currentIndex = 0;

  return order.map((status, index) => ({
    label: labels[status]!,
    date: dates[status] ?? null,
    status:
      index < currentIndex
        ? ("completed" as const)
        : index === currentIndex
          ? ("current" as const)
          : ("upcoming" as const),
  }));
}

export function bugListHref(
  mode: "reporter" | "admin",
  backHref?: string,
): string {
  return (
    backHref ?? (mode === "admin" ? PATHS.admin.bugReports : PATHS.bugReports)
  );
}
