import { SkeletonRows } from '@/shared/components/Skeletons'
import { PaginationContainer } from '@/shared/containers/PaginationContainer'
import { ProductsTableHeader, ProductsTableContent } from './ProductsTableComponents'

interface ProductRow {
  id: string
  name: string
  slug?: string
  sku: string
  stock: number
  lowStockAt: number
  basePrice: number
  status: string
}

interface ProductsTableViewProps {
  search: string
  isLoading: boolean
  products?: ProductRow[]
  page: number
  totalPages?: number
  isDeleting?: boolean
  onSearchChange: (value: string) => void
  onPageChange: (page: number) => void
  onAddProduct?: () => void
  onEditProduct?: (product: ProductRow) => void
  onDeleteProduct?: (product: ProductRow) => void
}

export function ProductsTableView({
  search,
  isLoading,
  products,
  page,
  totalPages,
  isDeleting,
  onSearchChange,
  onPageChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsTableViewProps) {
  return (
    <div>
      <ProductsTableHeader
        search={search}
        onSearchChange={onSearchChange}
        onAddProduct={onAddProduct}
      />

      {isLoading ? (
        <SkeletonRows count={5} height="h-10 w-full" />
      ) : (
        <ProductsTableContent
          products={products}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
          isDeleting={isDeleting}
        />
      )}

      {totalPages && totalPages > 1 && (
        <PaginationContainer currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  )
}
