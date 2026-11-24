import { PATHS } from "@/shared/constants/paths/paths";
import {
  BUG_REPORT_STATUS,
  type BugReportStatus,
} from "@/shared/constants/statuses";
import type { BugReport } from "../../api/list/bugReports.api";
import { statusTimeline, timelineActionLabel } from "./bugReportTimeline.utils";

export { statusTimeline, timelineActionLabel };

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

export function bugListHref(
  mode: "reporter" | "admin",
  backHref?: string,
): string {
  return (
    backHref ?? (mode === "admin" ? PATHS.admin.bugReports : PATHS.bugReports)
  );
}
