"use client";

import { useRouter } from "next/navigation";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { ProductsTableView } from "../../components/products/ProductsTableView.component";
import { VendorProductFormDialog } from "../../components/products/VendorProductFormDialog.component";
import { VendorBulkImportDialog } from "../../components/products/VendorBulkImportDialog.component";
import { useVendorProductsPage } from "../../hooks/products/useVendorProductsPage.hook";
import { vendorPagesStyles } from "../overview/vendorPages.styles";

export function ProductsTable() {
  const page = useVendorProductsPage();
  const ImagesDialog = page.ImagesDialog;
  const router = useRouter();

  return (
    <RequirePermission permission={[...page.permission]}>
      <>
        <div className={vendorPagesStyles.headerActions}>
          <VendorBulkImportDialog onImported={() => router.refresh()} />
        </div>
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
