"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BUG_REPORT_STATUS,
  type BugReportStatus,
} from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import {
  useMarkBugDuplicate,
  useUpdateBugStatus,
  useVerifyBug,
  useWontFixBug,
} from "../../api/bugReports.queries";
import type { BugReport } from "../../api/bugReports.api";
import { useBugComments } from "./useBugComments.hook";
import { useBugTriageForm } from "./useBugTriageForm.hook";
import {
  ADMIN_STATUS_TRANSITIONS,
  ASSIGNMENT_EDITABLE_STATUSES,
  statusTimeline,
} from "./bugReportDetailShared";

/**
 * Owns the bug-report detail state: triage/assignment form, status updates
 * and duplicate/wont-fix actions (comments live in useBugComments).
 */
export function useBugReportActions(
  report: BugReport,
  mode: "reporter" | "admin",
) {
  const verify = useVerifyBug(report.id);
  const updateStatus = useUpdateBugStatus(report.id);
  const duplicate = useMarkBugDuplicate(report.id);
  const wontFix = useWontFixBug(report.id);
  const commentsState = useBugComments(report, mode === "admin");
  const triageForm = useBugTriageForm(report);

  const [status, setStatus] = useState<BugReportStatus>(
    ADMIN_STATUS_TRANSITIONS[report.status]?.[0] ??
      BUG_REPORT_STATUS.IN_PROGRESS,
  );
  const [duplicateOf, setDuplicateOf] = useState("");
  const [wontFixReason, setWontFixReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const statusOptions = useMemo(
    () => ADMIN_STATUS_TRANSITIONS[report.status] ?? [],
    [report.status],
  );
  const canMarkDuplicate = useMemo(
    () =>
      (
        [
          BUG_REPORT_STATUS.NEW,
          BUG_REPORT_STATUS.TRIAGED,
          BUG_REPORT_STATUS.IN_PROGRESS,
        ] as BugReportStatus[]
      ).includes(report.status),
    [report.status],
  );
  const canWontFix = useMemo(
    () => report.status === BUG_REPORT_STATUS.TRIAGED,
    [report.status],
  );

  useEffect(() => {
    if (statusOptions.length > 0 && !statusOptions.includes(status)) {
      setStatus(statusOptions[0]!);
    }
  }, [statusOptions, status]);

  const progress = useMemo(() => statusTimeline(report), [report]);
  const isNewReport = triageForm.isNewReport;
  const canEditAssignment =
    isNewReport || ASSIGNMENT_EDITABLE_STATUSES.includes(report.status);

  const onVerify = async () => {
    setActionError(null);
    try {
      await verify.mutateAsync();
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.bugCouldNotUpdate));
    }
  };

  const onChangeStatus = async () => {
    setActionError(null);
    try {
      await updateStatus.mutateAsync(status);
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.bugCouldNotUpdate));
    }
  };

  const onMarkDuplicate = async () => {
    setActionError(null);
    try {
      await duplicate.mutateAsync(duplicateOf.trim());
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.bugCouldNotUpdate));
    }
  };

  const onWontFix = async () => {
    setActionError(null);
    try {
      await wontFix.mutateAsync(wontFixReason.trim());
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.bugCouldNotUpdate));
    }
  };

  return {
    ...triageForm,
    status,
    setStatus,
    duplicateOf,
    setDuplicateOf,
    wontFixReason,
    setWontFixReason,
    actionError,
    statusOptions,
    canMarkDuplicate,
    canWontFix,
    progress,
    isNewReport,
    canEditAssignment,
    verify,
    updateStatus,
    duplicate,
    wontFix,
    ...commentsState,
    onVerify,
    onChangeStatus,
    onMarkDuplicate,
    onWontFix,
  };
}
