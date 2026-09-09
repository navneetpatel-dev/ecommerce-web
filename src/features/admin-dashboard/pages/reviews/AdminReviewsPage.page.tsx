"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { useAdminReviewsPage } from "../../hooks/reviews/useAdminReviewsPage";

export function AdminReviewsPage() {
  const page = useAdminReviewsPage();

  return (
    <AdminDataPage
      title={page.title}
      permission={page.permission}
      load={page.load}
      actions={page.actions}
      columnKeys={page.columnKeys}
    />
  );
}
