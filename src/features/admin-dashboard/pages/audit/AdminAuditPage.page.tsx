"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminAuditExportPanel } from "../../components/audit/AdminAuditExportPanel.component";
import { AdminAuditFilters } from "../../components/audit/AdminAuditFilters.component";
import { useAdminAuditPage } from "../../hooks/audit/useAdminAuditPage.hook";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminAuditPage() {
  const page = useAdminAuditPage();
  return (
    <RequirePermission permission={PERMISSIONS.AUDIT_VIEW}>
      <div className={adminPagesStyles.stack6}>
        <AdminAuditFilters {...page.filters} />
        <AdminAuditExportPanel />
        <AdminDataPage
          title={page.title}
          permission={page.permission}
          load={page.load}
          columnKeys={page.columnKeys}
          hideTitle
        />
      </div>
    </RequirePermission>
  );
}
