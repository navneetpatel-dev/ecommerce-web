"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { ProductsTableView } from "../components/ProductsTableView.component";
import { VendorProductFormDialog } from "../components/VendorProductFormDialog.component";
import { useVendorProductsPage } from "../hooks/useVendorProductsPage.hook";

export function ProductsTable() {
  const page = useVendorProductsPage();
  const ImagesDialog = page.ImagesDialog;

  return (
    <RequirePermission permission={[...page.permission]}>
      <>
        <ProductsTableView {...page.tableViewProps} />
        <VendorProductFormDialog {...page.formDialogProps} />
        <StatusDialog {...page.deleteDialogProps} />
        {page.imagesDialogProps ? (
          <ImagesDialog {...page.imagesDialogProps} />
        ) : null}
      </>
    </RequirePermission>
  );
}
