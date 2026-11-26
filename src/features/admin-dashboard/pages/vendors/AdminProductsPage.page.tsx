"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { ProductModerationQueue } from "./ProductModerationQueue.page";
import { AdminSectionTabs } from "../../components/shared/AdminSectionTabs.component";
import { AdminProductsFilters } from "../../components/vendors/AdminProductsFilters.component";
import { useAdminProductsPage } from "../../hooks/vendors/useAdminProductsPage";
import { adminPagesStyles } from "../shared/adminPages.styles";
import { LABELS } from "@/shared/constants/labels";
import { Button } from "@/shared/components/ui/button";
import { ProductVariantsDialog } from "@/features/products";
import { AdminProductEditorDialog } from "../../components/vendors/AdminProductEditorDialog.component";
import { SubmitOnBehalfDialog } from "../../components/vendors/SubmitOnBehalfDialog.component";
import { adminProductEditorStyles } from "../../components/vendors/adminProductEditor.styles";

export function AdminProductsPage() {
  const page = useAdminProductsPage();

  const editor = page.editor;
  const catalog = (
    <div className={adminPagesStyles.stack6}>
      {editor.canCreate ? (
        <div className={adminProductEditorStyles.headerActions}>
          <Button type="button" onClick={editor.openCreate}>
            {LABELS.addProductForVendor}
          </Button>
        </div>
      ) : null}
      <AdminProductsFilters {...page.filters} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
        hideTitle={page.showApprovalQueue}
        fetchRowDetail={page.fetchDetail}
        cellOverrides={page.cellOverrides}
      />
      <AdminProductEditorDialog {...editor.editorDialogProps} />
      {editor.variantsDialogProps ? (
        <ProductVariantsDialog {...editor.variantsDialogProps} />
      ) : null}
      {editor.submitDialogProps ? (
        <SubmitOnBehalfDialog {...editor.submitDialogProps} />
      ) : null}
    </div>
  );

  if (!page.showApprovalQueue) {
    return catalog;
  }

  const hasFilter = Boolean(
    page.filters.search ||
    page.filters.categoryId ||
    page.filters.vendorId ||
    page.filters.inStock ||
    page.filters.minPrice ||
    page.filters.maxPrice ||
    page.filters.sort,
  );
  const defaultTab =
    page.filters.status === "PENDING_APPROVAL" ||
    page.filters.status === "PENDING"
      ? "pending"
      : hasFilter
        ? "all"
        : page.pendingCount > 0
          ? "pending"
          : "all";
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
