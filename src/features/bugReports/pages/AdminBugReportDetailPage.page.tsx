"use client";

import { useParams } from "next/navigation";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useBugReport } from "../api/bugReports.queries";
import { BugReportDetail } from "../components/BugReportDetail.component";

export function AdminBugReportDetailPage() {
  return (
    <RequirePermission permission={PERMISSIONS.BUG_REPORT_MANAGE}>
      <AdminBugReportDetailContent />
    </RequirePermission>
  );
}

function AdminBugReportDetailContent() {
  const params = useParams<{ id: string }>();
  const reportId = params.id;
  const query = useBugReport(reportId);
  const { data, isLoading, isEmpty, error } = resolveQueryDetailState(query, {
    enabled: Boolean(reportId),
  });

  if (isLoading) return <DetailQuerySkeleton className="space-y-3 py-4" />;
  if (isEmpty) {
    return (
      <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
        {(error as Error | null)?.message || LABELS.bugCouldNotLoadDetail}
      </p>
    );
  }

  return <BugReportDetail report={data!} mode="admin" />;
}
