"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { SupportAuthGate } from "@/features/supportTickets";
import { useBugReport } from "../api/bugReports.queries";
import { BugReportDetail } from "../components/BugReportDetail";

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
  const { data, isLoading, isError, error } = useBugReport(id);

  if (isLoading) {
    return (
      <div className="storefront-container space-y-3 py-4">
        <Skeleton className="h-16 w-full max-w-xl" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="storefront-container py-8">
        <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
          {(error as Error | null)?.message || LABELS.bugCouldNotLoadDetail}
        </p>
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
          report={data}
          mode="reporter"
          backHref={PATHS.bugReports}
        />
      </div>
    </div>
  );
}
