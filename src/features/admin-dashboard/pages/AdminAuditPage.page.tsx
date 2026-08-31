"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { AdminDataPage } from "./AdminDataPage.page";
import { AdminAuditExportPanel } from "../components/AdminAuditExportPanel.component";
import { useAdminAuditPage } from "../hooks/useAdminAuditPage.hook";

export function AdminAuditPage() {
  const page = useAdminAuditPage();
  return (
    <RequirePermission permission={PERMISSIONS.AUDIT_VIEW}>
      <div className="space-y-6">
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
