'use client'

import { useState } from 'react'
import { useVendorProducts } from '../api/vendor.queries'

export function useVendorProductsTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useVendorProducts(page, search ? { search } : undefined)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return {
    page,
    search,
    data,
    isLoading,
    setPage,
    handleSearchChange,
  }
}
