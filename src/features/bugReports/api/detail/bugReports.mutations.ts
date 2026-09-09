import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  BugAffectedModule,
  BugReportSeverity,
  BugReportStatus,
} from "@/shared/constants/statuses";
import { bugReportsApi } from "../list/bugReports.api";
import { bugReportKeys } from "../list/bugReports.keys";

interface BugTriageInput {
  severity: BugReportSeverity;
  affectedModule: BugAffectedModule;
  assignedToId?: string | null;
}

/** Refreshes the detail record plus every list after a detail mutation. */
function useInvalidateBugDetail(id: string) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({
      queryKey: bugReportKeys.detail(id),
    });
    void queryClient.invalidateQueries({ queryKey: bugReportKeys.all });
  };
}

export function useTriageBugReport(id: string) {
  const invalidate = useInvalidateBugDetail(id);
  return useMutation({
    mutationFn: (body: BugTriageInput) => bugReportsApi.triage(id, body),
    onSuccess: invalidate,
  });
}

export function useUpdateBugAssignment(id: string) {
  const invalidate = useInvalidateBugDetail(id);
  return useMutation({
    mutationFn: (body: BugTriageInput) =>
      bugReportsApi.updateAssignment(id, body),
    onSuccess: invalidate,
  });
}

export function useUpdateBugStatus(id: string) {
  const invalidate = useInvalidateBugDetail(id);
  return useMutation({
    mutationFn: (status: BugReportStatus) =>
      bugReportsApi.updateStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useMarkBugDuplicate(id: string) {
  const invalidate = useInvalidateBugDetail(id);
  return useMutation({
    mutationFn: (duplicateOf: string) =>
      bugReportsApi.markDuplicate(id, duplicateOf),
    onSuccess: invalidate,
  });
}

export function useWontFixBug(id: string) {
  const invalidate = useInvalidateBugDetail(id);
  return useMutation({
    mutationFn: (reason: string) => bugReportsApi.wontFix(id, reason),
    onSuccess: invalidate,
  });
}

export function useVerifyBug(id: string) {
  const invalidate = useInvalidateBugDetail(id);
  return useMutation({
    mutationFn: () => bugReportsApi.verify(id),
    onSuccess: invalidate,
  });
}

export function useAddBugComment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => bugReportsApi.addComment(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.comments(id),
      });
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.detail(id),
      });
    },
  });
}
