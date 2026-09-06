"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { AdminUsersFilters } from "../components/AdminUsersFilters.component";
import { useAdminUsersPage } from "../hooks/useAdminUsersPage";

export function AdminUsersPage() {
  const page = useAdminUsersPage();

  return (
    <div className="space-y-6">
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
