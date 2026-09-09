"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { AdminOrdersFilters } from "../components/AdminOrdersFilters.component";
import { useAdminOrdersPage } from "../hooks/useAdminOrdersPage";
import { adminPagesStyles } from "./adminPages.styles";

export function AdminOrdersPage() {
  const page = useAdminOrdersPage();

  return (
    <div className={adminPagesStyles.stack6}>
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
