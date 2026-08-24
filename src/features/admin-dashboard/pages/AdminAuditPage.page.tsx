"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { useAdminAuditPage } from "../hooks/useAdminAuditPage.hook";

export function AdminAuditPage() {
  const page = useAdminAuditPage();
  return (
    <AdminDataPage
      title={page.title}
      permission={page.permission}
      load={page.load}
      columnKeys={page.columnKeys}
    />
  );
}
