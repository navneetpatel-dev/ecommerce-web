"use client";

import { useMemo } from "react";
import { PATHS } from "@/shared/constants/paths";
import type { BugReport } from "../../api/bugReports.api";
import { useBugReportActions } from "./useBugReportActions";
import { bugListHref } from "./bugReportDetailShared";
import { BugCommentsSection } from "./BugCommentsSection";
import { BugContextPanel } from "./BugContextPanel";
import { BugDescriptionSection } from "./BugDescriptionSection";
import { BugProgressPanel } from "./BugProgressPanel";
import { BugReportHeader } from "./BugReportHeader";
import { BugStatusUpdatePanel } from "./BugStatusUpdatePanel";
import { BugTriagePanel } from "./BugTriagePanel";

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
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <BugReportHeader report={report} mode={mode} backHref={backHref} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 space-y-5 lg:col-span-7 xl:col-span-8">
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

        <aside className="min-w-0 space-y-4 lg:col-span-5 xl:col-span-4">
          <div className="space-y-4 lg:sticky lg:top-24">
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
