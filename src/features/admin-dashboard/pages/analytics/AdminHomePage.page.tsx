"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAdminHomeRedirect } from "../../hooks/analytics/useAdminHomeRedirect.hook";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminHomePage() {
  useAdminHomeRedirect();

  return (
    <div className={adminPagesStyles.stack6}>
      <h1 className="sr-only">Admin Dashboard</h1>
      <div className={adminPagesStyles.stack1}>
        <Skeleton className={adminPagesStyles.skeletonH28} />
      </div>
      <div className={adminPagesStyles.gridCols4}>
        <Skeleton className={adminPagesStyles.skeletonH32} />
        <Skeleton className={adminPagesStyles.skeletonH32} />
        <Skeleton className={adminPagesStyles.skeletonH32} />
        <Skeleton className={adminPagesStyles.skeletonH32} />
      </div>
    </div>
  );
}
