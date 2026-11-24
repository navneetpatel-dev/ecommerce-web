"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { VendorApprovalQueue } from "./VendorApprovalQueue.page";
import { AdminSectionTabs } from "../../components/shared/AdminSectionTabs.component";
import { AdminVendorsFilters } from "../../components/vendors/AdminVendorsFilters.component";
import { useAdminVendorsPage } from "../../hooks/vendors/useAdminVendorsPage";
import { adminPagesStyles } from "../shared/adminPages.styles";
import { LABELS } from "@/shared/constants/labels";

export function AdminVendorsPage() {
  const page = useAdminVendorsPage();

  const allVendors = (
    <div className={adminPagesStyles.stack6}>
      <AdminVendorsFilters {...page.filters} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
        hideTitle={page.showApprovalQueue}
        fetchRowDetail={page.fetchDetail}
      />
    </div>
  );

  const hasFilter = Boolean(page.filters.search || page.filters.status);
  const defaultTab = hasFilter
    ? "all"
    : page.pendingCount > 0
      ? "pending"
      : "all";

  return (
    <RequirePermission permission={page.gatePermission}>
      {page.showApprovalQueue ? (
        <AdminSectionTabs
          title={page.title}
          defaultValue={defaultTab}
          tabs={[
            {
              value: "pending",
              label: LABELS.pendingReview,
              count: page.pendingCount,
              content: <VendorApprovalQueue />,
            },
            {
              value: "all",
              label: LABELS.allVendors,
              content: allVendors,
            },
          ]}
        />
      ) : (
        allVendors
      )}
    </RequirePermission>
  );
}
