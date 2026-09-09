"use client";

import { useParams } from "next/navigation";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useBugReport } from "../api/bugReports.queries";
import { BugReportDetail } from "../components/BugReportDetail.component";
import { bugReportsPagesStyles } from "./bugReportsPages.styles";

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

  if (isLoading)
    return (
      <DetailQuerySkeleton
        className={bugReportsPagesStyles.detailSkeletonMargin}
      />
    );
  if (isEmpty) {
    return (
      <div className={bugReportsPagesStyles.errorBox}>
        <QueryErrorAlert
          error={error}
          fallback={LABELS.bugCouldNotLoadDetail}
        />
      </div>
    );
  }

  return <BugReportDetail report={data!} mode="admin" />;
}
