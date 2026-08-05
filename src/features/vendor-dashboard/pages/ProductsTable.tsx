'use client'
import { useState } from 'react'
import { useVendorProducts } from '../api/vendor.queries'
import { SkeletonRows } from '@/shared/components/Skeletons'
import { Pagination } from '@/shared/components/Pagination'
import { ProductsTableHeader, ProductsTableContent } from '../components/ProductsTableComponents'

export function ProductsTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useVendorProducts(page, search ? { search } : undefined)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div>
      <ProductsTableHeader search={search} onSearchChange={handleSearchChange} />

      {isLoading ? (
        <SkeletonRows count={5} height="h-10 w-full" />
      ) : (
        <ProductsTableContent products={data?.items as any} />
      )}

      {data && data.totalPages > 1 && (
        <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
