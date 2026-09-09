"use client";

import { useMemo } from "react";
import { PATHS } from "@/shared/constants/paths/paths";
import type { BugReport } from "../../../api/list/bugReports.api";
import { useBugReportActions } from "../../../hooks/detail/useBugReportActions.hook";
import { bugListHref } from "../../../utils/detail/bugReportDetailShared";
import { BugCommentsSection } from "./BugCommentsSection.component";
import { BugContextPanel } from "./BugContextPanel.component";
import { BugDescriptionSection } from "./BugDescriptionSection.component";
import { BugProgressPanel } from "./BugProgressPanel.component";
import { BugReportHeader } from "./BugReportHeader.component";
import { BugStatusUpdatePanel } from "./BugStatusUpdatePanel.component";
import { BugTriagePanel } from "./BugTriagePanel.component";
import { bugReportDetailStyles } from "../../../styles/detail/bugReportDetail.styles";

export function BugReportDetail({
  report,
  mode,
  backHref,
}: {
  report: BugReport;
  mode: "reporter" | "admin";
  backHref?: string;
}) {
  const actions = useBugReportActions(report, mode);
  const listHref = bugListHref(mode, backHref);

  const duplicateOfHref = useMemo(
    () =>
      report.duplicateOfId
        ? mode === "admin"
          ? PATHS.admin.bugReport(report.duplicateOfId)
          : listHref.startsWith("/vendor/")
            ? PATHS.vendor.bugReport(report.duplicateOfId)
            : PATHS.bugReport(report.duplicateOfId)
        : null,
    [report.duplicateOfId, mode, listHref],
  );

  return (
    <div className={bugReportDetailStyles.root}>
      <BugReportHeader report={report} mode={mode} backHref={backHref} />

      <div className={bugReportDetailStyles.grid}>
        <div className={bugReportDetailStyles.mainCol}>
          <BugDescriptionSection
            report={report}
            mode={mode}
            duplicateOfHref={duplicateOfHref}
          />

          {mode === "admin" ? (
            <BugCommentsSection
              comments={actions.comments}
              isLoading={actions.commentsQuery.isLoading}
              hasNextPage={Boolean(actions.commentsQuery.hasNextPage)}
              isFetchingNextPage={actions.commentsQuery.isFetchingNextPage}
              onLoadMore={() => void actions.commentsQuery.fetchNextPage()}
              comment={actions.comment}
              onCommentChange={actions.setComment}
              addPending={actions.addComment.isPending}
              error={actions.error}
              onAdd={() => void actions.onAddComment()}
            />
          ) : null}
        </div>

        <aside className={bugReportDetailStyles.asideCol}>
          <div className={bugReportDetailStyles.stickyAside}>
            {mode === "admin" ? (
              <BugContextPanel report={report} mode={mode} />
            ) : null}

            <BugProgressPanel
              report={report}
              mode={mode}
              progress={actions.progress}
              verifyPending={actions.verify.isPending}
              actionError={actions.actionError}
              onVerify={() => void actions.onVerify()}
            />

            {mode === "reporter" ? (
              <BugContextPanel report={report} mode={mode} />
            ) : null}

            {mode === "admin" ? (
              <>
                <BugTriagePanel
                  report={report}
                  severity={actions.severity}
                  onSeverityChange={actions.setSeverity}
                  module={actions.module}
                  onModuleChange={actions.setModule}
                  assigneeId={actions.assigneeId}
                  onAssigneeChange={actions.setAssigneeId}
                  assignmentError={actions.assignmentError}
                  savePending={actions.savePending}
                  canEditAssignment={actions.canEditAssignment}
                  isNewReport={actions.isNewReport}
                  onSave={() => void actions.onSaveTriage()}
                />

                <BugStatusUpdatePanel
                  statusOptions={actions.statusOptions}
                  status={actions.status}
                  onStatusChange={actions.setStatus}
                  updatePending={actions.updateStatus.isPending}
                  canMarkDuplicate={actions.canMarkDuplicate}
                  duplicateOf={actions.duplicateOf}
                  onDuplicateOfChange={actions.setDuplicateOf}
                  duplicatePending={actions.duplicate.isPending}
                  canWontFix={actions.canWontFix}
                  wontFixReason={actions.wontFixReason}
                  onWontFixReasonChange={actions.setWontFixReason}
                  wontFixPending={actions.wontFix.isPending}
                  actionError={actions.actionError}
                  onChangeStatus={() => void actions.onChangeStatus()}
                  onMarkDuplicate={() => void actions.onMarkDuplicate()}
                  onWontFix={() => void actions.onWontFix()}
                />
              </>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
