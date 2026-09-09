"use client";

import { useAdminAnalyticsPage } from "../hooks/useAdminAnalyticsPage.hook";
import { AdminAnalyticsLayout } from "../components/AdminAnalyticsLayout.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { adminPagesStyles } from "./adminPages.styles";

export function AdminAnalyticsPage() {
  const page = useAdminAnalyticsPage();

  if (page.isLoading) {
    const skeletonCards = Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={index} className={adminPagesStyles.skeletonH32} />
    ));

    return (
      <div className={adminPagesStyles.stack6}>
        <Skeleton className={adminPagesStyles.skeletonH28} />
        <div className={adminPagesStyles.gridCols4}>{skeletonCards}</div>
        <Skeleton className={adminPagesStyles.skeletonH72} />
      </div>
    );
  }

  if (page.isEmpty || !page.data) {
    return (
      <p className={adminPagesStyles.emptyBodyText}>{LABELS.analyticsNoData}</p>
    );
  }

  return <AdminAnalyticsLayout data={page.data} />;
}
