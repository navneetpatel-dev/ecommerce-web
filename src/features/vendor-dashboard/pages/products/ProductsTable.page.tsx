"use client";

import { useRouter } from "next/navigation";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { ProductsTableView } from "../../components/products/ProductsTableView.component";
import {
  ProductCustomerPreviewDialog,
  ProductEditorDialog,
  ProductVariantsDialog,
} from "@/features/products";
import { VendorBulkImportDialog } from "../../components/products/VendorBulkImportDialog.component";
import { useVendorProductsPage } from "../../hooks/products/useVendorProductsPage.hook";
import { vendorPagesStyles } from "../overview/vendorPages.styles";

export function ProductsTable() {
  const page = useVendorProductsPage();
  const ImagesDialog = page.ImagesDialog;
  const router = useRouter();

  const handleImported = () => router.refresh();

  return (
    <RequirePermission permission={[...page.permission]}>
      <>
        {page.tableViewProps.onAddProduct ? (
          <div className={vendorPagesStyles.headerActions}>
            <VendorBulkImportDialog onImported={handleImported} />
          </div>
        ) : null}
        <ProductsTableView {...page.tableViewProps} />
        <ProductEditorDialog {...page.formDialogProps} />
        <StatusDialog {...page.deleteDialogProps} />
        {page.imagesDialogProps ? (
          <ImagesDialog {...page.imagesDialogProps} />
        ) : null}
        {page.previewDialogProps ? (
          <ProductCustomerPreviewDialog {...page.previewDialogProps} />
        ) : null}
        {page.variantsDialogProps ? (
          <ProductVariantsDialog {...page.variantsDialogProps} />
        ) : null}
      </>
    </RequirePermission>
  );
}
