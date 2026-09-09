"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminOrdersFilters } from "../../components/orders/AdminOrdersFilters.component";
import { useAdminOrdersPage } from "../../hooks/orders/useAdminOrdersPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

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
