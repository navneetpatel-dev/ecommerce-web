'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useVendorProducts } from '../api/vendor.queries'
import { productsApi } from '@/features/products/api/products.api'

export function useVendorProductsTable() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const { data, isLoading } = useVendorProducts(page, search ? { search } : undefined)

  const deleteProduct = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] })
      setDeleteTarget(null)
    },
  })

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
    deleteTarget,
    setDeleteTarget,
    confirmDelete: () => {
      if (!deleteTarget) return
      deleteProduct.mutate(deleteTarget.id)
    },
    isDeleting: deleteProduct.isPending,
  }
}
