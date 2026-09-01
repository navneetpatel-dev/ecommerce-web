"use client";

import { useParams } from "next/navigation";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { PATHS } from "@/shared/constants/paths";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useBugReport } from "../api/bugReports.queries";
import { BugReportDetail } from "../components/BugReportDetail.component";

export function VendorBugReportDetailPage() {
  return (
    <RequirePermission permission={VENDOR_SUPPORT_ACCESS}>
      <VendorBugReportDetailContent />
    </RequirePermission>
  );
}

function VendorBugReportDetailContent() {
  const params = useParams<{ id: string }>();
  const reportId = params.id;
  const query = useBugReport(reportId);
  const { data, isLoading, isEmpty, error } = resolveQueryDetailState(query, {
    enabled: Boolean(reportId),
  });

  if (isLoading) return <DetailQuerySkeleton className="space-y-3 py-4" />;
  if (isEmpty) {
    return (
      <div className="border border-line bg-surface-raised px-5 py-10 text-center">
        <QueryErrorAlert
          error={error}
          fallback={LABELS.bugCouldNotLoadDetail}
        />
      </div>
    );
  }

  return (
    <BugReportDetail
      report={data!}
      mode="reporter"
      backHref={PATHS.vendor.bugReports}
    />
  );
}
