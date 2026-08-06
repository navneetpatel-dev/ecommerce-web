'use client'

import { RequirePermission } from '@/shared/components/RequirePermission'
import { StatusDialog } from '@/shared/components/StatusDialog'
import { ProductsTableView } from '../components/ProductsTableView'
import { VendorProductCreateForm } from '../components/VendorProductCreateForm'
import { useVendorProductsPage } from '../hooks/useVendorProductsPage'

export function ProductsTable() {
  const page = useVendorProductsPage()

  return (
    <RequirePermission permission={[...page.permission]}>
      <>
        {page.showCreateForm && <VendorProductCreateForm {...page.createFormProps} />}
        <ProductsTableView {...page.tableViewProps} />
        <StatusDialog {...page.deleteDialogProps} />
      </>
    </RequirePermission>
  )
}
