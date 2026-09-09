"use client";

import { useRouter } from "next/navigation";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { ProductsTableView } from "../components/ProductsTableView.component";
import { VendorProductFormDialog } from "../components/VendorProductFormDialog.component";
import { VendorBulkImportDialog } from "../components/VendorBulkImportDialog.component";
import { useVendorProductsPage } from "../hooks/useVendorProductsPage.hook";
import { vendorPagesStyles } from "./vendorPages.styles";

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
