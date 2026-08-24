"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { useAdminReviewsPage } from "../hooks/useAdminReviewsPage";

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
