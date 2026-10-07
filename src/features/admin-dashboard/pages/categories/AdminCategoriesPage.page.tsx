"use client";

import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { DiscardChangesDialog } from "@/shared/components/dialogs/DiscardChangesDialog.component";
import { CategoriesPageHeader } from "../../components/categories/CategoriesPageHeader.component";
import { CategoriesTable } from "../../components/categories/CategoriesTable.component";
import { useAdminCategoriesPage } from "../../hooks/categories/useAdminCategoriesPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminCategoriesPage() {
  const page = useAdminCategoriesPage();

  return (
    <div className={adminPagesStyles.stack6}>
      <CategoriesPageHeader
        open={page.open}
        setOpen={page.handleDialogOpenChange}
        form={page.form}
        onSubmit={page.onSubmit}
        isPending={page.isPending}
        error={page.createError}
        toolbar={page.reassignToolbar}
      />
      <DiscardChangesDialog
        open={page.discardOpen}
        onOpenChange={page.handleDiscardOpenChange}
        onDiscard={page.confirmDiscard}
        onKeepEditing={page.cancelDiscard}
      />
      <RequirePermission permission={page.permission}>
        <CategoriesTable
          categories={page.categories}
          loading={page.loading}
          error={page.error}
          onRefresh={page.reload}
          pagination={page.pagination}
          actions={page.renderActions}
        />
      </RequirePermission>
    </div>
  );
}
