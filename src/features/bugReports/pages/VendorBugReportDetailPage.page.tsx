"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
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
  const { data, isLoading, isError, error } = useBugReport(params.id);

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (isError || !data) {
    return (
      <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
        {(error as Error | null)?.message || LABELS.bugCouldNotLoadDetail}
      </p>
    );
  }

  return (
    <BugReportDetail
      report={data}
      mode="reporter"
      backHref={PATHS.vendor.bugReports}
    />
  );
}
