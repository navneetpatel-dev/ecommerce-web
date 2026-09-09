"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { useAdminReturnsPage } from "../../hooks/returns/useAdminReturnsPage";

export function AdminReturnsPage() {
  const page = useAdminReturnsPage();

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
