"use client";

import { useParams } from "next/navigation";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { PATHS } from "@/shared/constants/paths";
import { SupportAuthGate } from "@/features/supportTickets";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useBugReport } from "../api/bugReports.queries";
import { BugReportDetail } from "../components/BugReportDetail.component";

export function CustomerBugReportDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <SupportAuthGate
      message={LABELS.bugSignInRequired}
      loginNext={PATHS.bugReport(params.id)}
    >
      <CustomerBugReportDetailContent id={params.id} />
    </SupportAuthGate>
  );
}

function CustomerBugReportDetailContent({ id }: { id: string }) {
  const query = useBugReport(id);
  const { data, isLoading, isEmpty, error } = resolveQueryDetailState(query, {
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <DetailQuerySkeleton className="space-y-3 py-4" />;
  }

  if (isEmpty) {
    return (
      <div className="storefront-container py-8">
        <div className="border border-line bg-surface-raised px-5 py-10 text-center">
          <QueryErrorAlert
            error={error}
            fallback={LABELS.bugCouldNotLoadDetail}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_10%,transparent),transparent_60%)]"
      />
      <div className="storefront-container relative py-4 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:py-5 lg:pb-8">
        <BugReportDetail
          report={data!}
          mode="reporter"
          backHref={PATHS.bugReports}
        />
      </div>
    </div>
  );
}
