"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { useAdminOrdersPage } from "../hooks/useAdminOrdersPage";

export function AdminOrdersPage() {
  const page = useAdminOrdersPage();

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
