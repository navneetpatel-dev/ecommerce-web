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
export type { BugReportDetailProps } from "../../../utils/detail/bugReportDetailShared";
export type { ProgressStep } from "../../../utils/detail/bugReportDetailShared";
export { ADMIN_STATUS_TRANSITIONS } from "../../../utils/detail/bugReportDetailShared";
export { ASSIGNMENT_EDITABLE_STATUSES } from "../../../utils/detail/bugReportDetailShared";
export { bugListHref } from "../../../utils/detail/bugReportDetailShared";
export { statusTimeline } from "../../../utils/detail/bugReportDetailShared";
export { useBugComments } from "../../../hooks/detail/useBugComments.hook";
export { useBugReportActions } from "../../../hooks/detail/useBugReportActions.hook";
export { useBugTriageForm } from "../../../hooks/detail/useBugTriageForm.hook";
