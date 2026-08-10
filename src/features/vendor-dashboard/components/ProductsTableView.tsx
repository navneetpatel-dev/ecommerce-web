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
  isSubmitting?: boolean
  actionMessage?: string | null
  onSearchChange: (value: string) => void
  onPageChange: (page: number) => void
  onAddProduct?: () => void
  onEditProduct?: (product: ProductRow) => void
  onDeleteProduct?: (product: ProductRow) => void
  onSubmitForApproval?: (product: ProductRow) => void
  onManageImages?: (product: ProductRow) => void
}

export function ProductsTableView({
  search,
  isLoading,
  products,
  page,
  totalPages,
  isDeleting,
  isSubmitting,
  actionMessage,
  onSearchChange,
  onPageChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onSubmitForApproval,
  onManageImages,
}: ProductsTableViewProps) {
  return (
    <div>
      <ProductsTableHeader
        search={search}
        onSearchChange={onSearchChange}
        onAddProduct={onAddProduct}
      />

      {actionMessage ? (
        <p className="mb-3 text-[0.8125rem] text-ink-muted">{actionMessage}</p>
      ) : null}

      {isLoading ? (
        <SkeletonRows count={5} height="h-10 w-full" />
      ) : (
        <ProductsTableContent
          products={products}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
          onSubmitForApproval={onSubmitForApproval}
          onManageImages={onManageImages}
          isDeleting={isDeleting}
          isSubmitting={isSubmitting}
        />
      )}

      {totalPages && totalPages > 1 && (
        <PaginationContainer currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  )
}
