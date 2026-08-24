"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { ProductModerationQueue } from "./ProductModerationQueue.page";
import { AdminSectionTabs } from "../components/AdminSectionTabs.component";
import { useAdminProductsPage } from "../hooks/useAdminProductsPage";
import { LABELS } from "@/shared/constants/labels";

export function AdminProductsPage() {
  const page = useAdminProductsPage();

  const catalog = (
    <AdminDataPage
      title={page.title}
      permission={page.permission}
      load={page.load}
      actions={page.actions}
      columnKeys={page.columnKeys}
      hideTitle={page.showApprovalQueue}
    />
  );

  if (!page.showApprovalQueue) {
    return catalog;
  }

  return (
    <AdminSectionTabs
      title={page.title}
      defaultValue={page.pendingCount > 0 ? "pending" : "all"}
      tabs={[
        {
          value: "pending",
          label: LABELS.pendingReview,
          count: page.pendingCount,
          content: (
            <RequirePermission permission={page.approvePermission}>
              <ProductModerationQueue />
            </RequirePermission>
          ),
        },
        {
          value: "all",
          label: LABELS.allProducts,
          content: catalog,
        },
      ]}
    />
  );
}
