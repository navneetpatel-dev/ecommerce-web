'use client'

import { useVendorProductsTable } from '../hooks/useVendorProductsTable'
import { ProductsTableView } from '../components/ProductsTableView'

export function ProductsTable() {
  const table = useVendorProductsTable()

  return (
    <ProductsTableView
      search={table.search}
      isLoading={table.isLoading}
      products={table.data?.items}
      page={table.page}
      totalPages={table.data?.totalPages}
      onSearchChange={table.handleSearchChange}
      onPageChange={table.setPage}
    />
  )
}
