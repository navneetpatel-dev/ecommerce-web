import { SkeletonRows } from '@/shared/components/Skeletons'
import { PaginationContainer } from '@/shared/containers/PaginationContainer'
import { ProductsTableHeader, ProductsTableContent } from './ProductsTableComponents'

interface ProductsTableViewProps {
  search: string
  isLoading: boolean
  products?: unknown[]
  page: number
  totalPages?: number
  onSearchChange: (value: string) => void
  onPageChange: (page: number) => void
}

export function ProductsTableView({
  search,
  isLoading,
  products,
  page,
  totalPages,
  onSearchChange,
  onPageChange,
}: ProductsTableViewProps) {
  return (
    <div>
      <ProductsTableHeader search={search} onSearchChange={onSearchChange} />

      {isLoading ? (
        <SkeletonRows count={5} height="h-10 w-full" />
      ) : (
        <ProductsTableContent products={products as any} />
      )}

      {totalPages && totalPages > 1 && (
        <PaginationContainer currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  )
}
