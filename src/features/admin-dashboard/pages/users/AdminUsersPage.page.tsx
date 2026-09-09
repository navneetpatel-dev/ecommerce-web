"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminUsersFilters } from "../../components/users/AdminUsersFilters.component";
import { useAdminUsersPage } from "../../hooks/users/useAdminUsersPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminUsersPage() {
  const page = useAdminUsersPage();

  return (
    <div className={adminPagesStyles.stack6}>
      <AdminUsersFilters {...page.filters} />
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
