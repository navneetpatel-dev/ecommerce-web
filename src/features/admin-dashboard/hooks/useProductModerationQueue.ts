'use client'

import { useCallback } from 'react'
import { useAdminDataList } from './useAdminDataList'
import { useProductModeration } from './useProductModeration'
import { adminApi } from '../api/admin.api'

type PendingProduct = {
  id: string
  name: string
  imageUrl?: string | null
  basePrice: number
}

export function useProductModerationQueue() {
  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) => adminApi.pendingProducts({ page, limit }),
    [],
  )
  const list = useAdminDataList(load)
  const { approve, reject } = useProductModeration()

  const onApprove = useCallback(
    async (id: string) => {
      await approve.mutateAsync(id)
      list.reload()
    },
    [approve, list],
  )

  const onReject = useCallback(
    async (id: string, note: string) => {
      await reject.mutateAsync({ id, note })
      list.reload()
    },
    [reject, list],
  )

  return {
    products: list.rows as unknown as PendingProduct[],
    isLoading: list.loading,
    reload: list.reload,
    pagination: {
      page: list.page,
      totalPages: list.totalPages,
      total: list.total,
      from: list.from,
      to: list.to,
      onPageChange: list.onPageChange,
    },
    onApprove,
    onReject,
    isApproving: approve.isPending,
    isRejecting: reject.isPending,
  }
}
