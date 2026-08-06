'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useVendorProductsTable } from '../hooks/useVendorProductsTable'
import { ProductsTableView } from '../components/ProductsTableView'
import { StatusDialog } from '@/shared/components/StatusDialog'
import { navigate } from '@/shared/utils/navigate'

export function ProductsTable() {
  const router = useRouter()
  const table = useVendorProductsTable()

  return (
    <>
      <ProductsTableView
        search={table.search}
        isLoading={table.isLoading}
        products={(table.data?.items ?? []).map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.variants?.[0]?.sku ?? product.sku ?? '—',
          stock: product.stock ?? product.variants?.[0]?.stock ?? 0,
          lowStockAt: product.variants?.[0]?.lowStockAt ?? 5,
          basePrice: product.basePrice,
          status: product.status ?? 'LIVE',
        }))}
        page={table.page}
        totalPages={table.data?.totalPages}
        isDeleting={table.isDeleting}
        onSearchChange={table.handleSearchChange}
        onPageChange={table.setPage}
        onAddProduct={() =>
          window.alert('Product create form is coming soon. Use the products API to add items for now.')
        }
        onEditProduct={(product) => {
          if (product.slug) {
            navigate(router, `/products/${product.slug}`)
            return
          }
          window.alert('This product cannot be opened for editing yet.')
        }}
        onDeleteProduct={(product) => table.setDeleteTarget({ id: product.id, name: product.name })}
      />

      <StatusDialog
        open={Boolean(table.deleteTarget)}
        onOpenChange={(open) => {
          if (!open) table.setDeleteTarget(null)
        }}
        variant="danger"
        icon={Trash2}
        title="Delete product?"
        description={
          table.deleteTarget
            ? `Delete “${table.deleteTarget.name}”? This cannot be undone.`
            : 'This cannot be undone.'
        }
        secondaryAction={{
          label: 'Cancel',
          onClick: () => table.setDeleteTarget(null),
        }}
        primaryAction={{
          label: 'Delete',
          variant: 'destructive',
          loading: table.isDeleting,
          onClick: () => table.confirmDelete(),
        }}
      />
    </>
  )
}
