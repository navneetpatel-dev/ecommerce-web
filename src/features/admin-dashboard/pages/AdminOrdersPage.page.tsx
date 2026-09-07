"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { AdminOrdersFilters } from "../components/AdminOrdersFilters.component";
import { useAdminOrdersPage } from "../hooks/useAdminOrdersPage";

export function AdminOrdersPage() {
  const page = useAdminOrdersPage();

  return (
    <div className="space-y-6">
      <AdminOrdersFilters {...page.filters} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
      />
    </div>
  );
}
