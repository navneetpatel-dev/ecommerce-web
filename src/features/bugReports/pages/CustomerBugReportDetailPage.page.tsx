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
import { bugReportsPagesStyles } from "./bugReportsPages.styles";

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
    return (
      <DetailQuerySkeleton
        className={bugReportsPagesStyles.detailSkeletonMargin}
      />
    );
  }

  if (isEmpty) {
    return (
      <div className={bugReportsPagesStyles.customerDetailErrorContainer}>
        <div className={bugReportsPagesStyles.errorBox}>
          <QueryErrorAlert
            error={error}
            fallback={LABELS.bugCouldNotLoadDetail}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={bugReportsPagesStyles.customerDetailRoot}>
      <div aria-hidden className={bugReportsPagesStyles.customerDetailGlow} />
      <div className={bugReportsPagesStyles.customerDetailContainer}>
        <BugReportDetail
          report={data!}
          mode="reporter"
          backHref={PATHS.bugReports}
        />
      </div>
    </div>
  );
}
