"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { CategoriesPageHeader } from "../components/CategoriesPageHeader.component";
import { CategoriesTable } from "../components/CategoriesTable.component";
import { useAdminCategoriesPage } from "../hooks/useAdminCategoriesPage";

export function AdminCategoriesPage() {
  const page = useAdminCategoriesPage();

  return (
    <div className="space-y-6">
      <CategoriesPageHeader
        open={page.open}
        setOpen={page.setOpen}
        form={page.form}
        onSubmit={page.onSubmit}
        isPending={page.isPending}
        error={page.createError}
        toolbar={page.reassignToolbar}
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
