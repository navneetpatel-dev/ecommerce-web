"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
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
  const { data, isLoading, isError, error } = useBugReport(params.id);

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (isError || !data) {
    return (
      <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
        {(error as Error | null)?.message || LABELS.bugCouldNotLoadDetail}
      </p>
    );
  }

  return <BugReportDetail report={data} mode="admin" />;
}
