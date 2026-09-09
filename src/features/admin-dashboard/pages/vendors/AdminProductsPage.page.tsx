"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { ProductModerationQueue } from "./ProductModerationQueue.page";
import { AdminSectionTabs } from "../../components/shared/AdminSectionTabs.component";
import { useAdminProductsPage } from "../../hooks/vendors/useAdminProductsPage";
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

  const defaultTab = page.pendingCount > 0 ? "pending" : "all";
  const pendingTabContent = (
    <RequirePermission permission={page.approvePermission}>
      <ProductModerationQueue />
    </RequirePermission>
  );
  const tabs = [
    {
      value: "pending",
      label: LABELS.pendingReview,
      count: page.pendingCount,
      content: pendingTabContent,
    },
    {
      value: "all",
      label: LABELS.allProducts,
      content: catalog,
    },
  ];

  return (
    <AdminSectionTabs
      title={page.title}
      defaultValue={defaultTab}
      tabs={tabs}
    />
  );
}
