"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminReturnsFilters } from "../../components/returns/AdminReturnsFilters.component";
import { useAdminReturnsPage } from "../../hooks/returns/useAdminReturnsPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminReturnsPage() {
  const page = useAdminReturnsPage();

  return (
    <div className={adminPagesStyles.stack6}>
      <AdminReturnsFilters {...page.filters} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
        fetchRowDetail={page.fetchDetail}
      />
    </div>
  );
}
