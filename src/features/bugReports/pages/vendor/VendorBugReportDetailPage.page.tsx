"use client";

import { useParams } from "next/navigation";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useBugReport } from "../../api/list/bugReports.queries";
import { BugReportDetail } from "../../components/detail/BugReportDetail.component";
import { bugReportsPagesStyles } from "../customer/bugReportsPages.styles";

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

  return (
    <BugReportDetail
      report={data!}
      mode="reporter"
      backHref={PATHS.vendor.bugReports}
    />
  );
}
