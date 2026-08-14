'use client'

import { RequirePermission } from '@/shared/components/RequirePermission'
import { StatusDialog } from '@/shared/components/StatusDialog'
import { ProductsTableView } from '../components/ProductsTableView'
import { VendorProductFormDialog } from '../components/VendorProductFormDialog'
import { useVendorProductsPage } from '../hooks/useVendorProductsPage'

export function ProductsTable() {
  const page = useVendorProductsPage()
  const ImagesDialog = page.ImagesDialog

  return (
    <RequirePermission permission={[...page.permission]}>
      <>
        <ProductsTableView {...page.tableViewProps} />
        <VendorProductFormDialog {...page.formDialogProps} />
        <StatusDialog {...page.deleteDialogProps} />
        {page.imagesDialogProps ? <ImagesDialog {...page.imagesDialogProps} /> : null}
      </>
    </RequirePermission>
  )
}
