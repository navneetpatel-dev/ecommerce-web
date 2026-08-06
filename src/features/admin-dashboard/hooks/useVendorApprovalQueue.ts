'use client'

import { useCallback } from 'react'
import { useAdminDataList } from './useAdminDataList'
import { useVendorApproval } from './useVendorApproval'
import { adminApi } from '../api/admin.api'
import type { VendorInfo } from '@/shared/api/types'

export function useVendorApprovalQueue() {
  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) => adminApi.pendingVendors({ page, limit }),
    [],
  )
  const list = useAdminDataList(load)
  const { approve, reject } = useVendorApproval()

  const onApprove = useCallback(
    async (id: string) => {
      await approve.mutateAsync(id)
      list.reload()
    },
    [approve, list],
  )

  const onReject = useCallback(
    async (id: string, reason: string) => {
      await reject.mutateAsync({ id, reason })
      list.reload()
    },
    [reject, list],
  )

  return {
    vendors: list.rows as unknown as VendorInfo[],
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
