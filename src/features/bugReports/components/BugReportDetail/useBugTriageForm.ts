"use client";

import { useEffect, useState } from "react";
import {
  BUG_AFFECTED_MODULE,
  BUG_REPORT_SEVERITY,
  type BugAffectedModule,
  type BugReportSeverity,
} from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import {
  useTriageBugReport,
  useUpdateBugAssignment,
} from "../../api/bugReports.queries";
import type { BugReport } from "../../api/bugReports.api";

/** Severity/module/assignee triage form state and save handler (Rule 12). */
export function useBugTriageForm(report: BugReport) {
  const triage = useTriageBugReport(report.id);
  const updateAssignment = useUpdateBugAssignment(report.id);
  const [severity, setSeverity] = useState<BugReportSeverity>(
    report.severity ?? BUG_REPORT_SEVERITY.MEDIUM,
  );
  const [module, setModule] = useState<BugAffectedModule>(
    report.affectedModule ?? BUG_AFFECTED_MODULE.OTHER,
  );
  const [assigneeId, setAssigneeId] = useState(report.assignedToId ?? "");
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  useEffect(() => {
    setAssigneeId(report.assignedToId ?? "");
    setSeverity(report.severity ?? BUG_REPORT_SEVERITY.MEDIUM);
    setModule(report.affectedModule ?? BUG_AFFECTED_MODULE.OTHER);
  }, [report.assignedToId, report.severity, report.affectedModule]);

  const isNewReport = report.status === "NEW";

  const onSaveTriage = async () => {
    setAssignmentError(null);
    const body = {
      severity,
      affectedModule: module,
      assignedToId: assigneeId.trim() || null,
    };
    try {
      if (isNewReport) {
        await triage.mutateAsync(body);
      } else {
        await updateAssignment.mutateAsync(body);
      }
    } catch (err) {
      setAssignmentError(
        getApiErrorMessage(err, LABELS.bugCouldNotSaveAssignment),
      );
    }
  };

  return {
    severity,
    setSeverity,
    module,
    setModule,
    assigneeId,
    setAssigneeId,
    assignmentError,
    savePending: triage.isPending || updateAssignment.isPending,
    isNewReport,
    onSaveTriage,
  };
}
