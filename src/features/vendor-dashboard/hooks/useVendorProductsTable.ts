'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useVendorProducts } from '../api/vendor.queries'
import { productsApi } from '@/features/products/api/products.api'

export function useVendorProductsTable() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useVendorProducts(page, search ? { search } : undefined)

  const deleteProduct = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] }),
  })

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return
    deleteProduct.mutate(id)
  }

  return {
    page,
    search,
    data,
    isLoading,
    setPage,
    handleSearchChange,
    handleDelete,
    isDeleting: deleteProduct.isPending,
  }
}
