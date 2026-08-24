// Barrel for the folder's subparts. The entry component lives beside
// this folder as "../BugReportDetail.component" — do not re-export it here, it
// imports subparts from this barrel (would be a circular module).
export { AttachmentGrid } from "./BugAttachmentGrid.component";
export { ContextRow } from "./BugAttachmentGrid.component";
export { BugCommentsSection } from "./BugCommentsSection.component";
export { BugContextPanel } from "./BugContextPanel.component";
export { BugDescriptionSection } from "./BugDescriptionSection.component";
export { BugProgressPanel } from "./BugProgressPanel.component";
export { ProgressTrack } from "./BugProgressTrack.component";
export { BugReportHeader } from "./BugReportHeader.component";
export { BugStatusUpdatePanel } from "./BugStatusUpdatePanel.component";
export { BugTriagePanel } from "./BugTriagePanel.component";
export type { BugReportDetailProps } from "./bugReportDetailShared";
export type { ProgressStep } from "./bugReportDetailShared";
export { ADMIN_STATUS_TRANSITIONS } from "./bugReportDetailShared";
export { ASSIGNMENT_EDITABLE_STATUSES } from "./bugReportDetailShared";
export { bugListHref } from "./bugReportDetailShared";
export { statusTimeline } from "./bugReportDetailShared";
export { useBugComments } from "./useBugComments.hook";
export { useBugReportActions } from "./useBugReportActions.hook";
export { useBugTriageForm } from "./useBugTriageForm.hook";
