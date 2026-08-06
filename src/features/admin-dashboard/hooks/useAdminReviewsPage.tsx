'use client'

import { useCallback, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { reviewsApi } from '@/features/reviews/api/reviews.api'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export function useAdminReviewsPage(): AdminListPageModel {
  const load = useCallback(() => reviewsApi.pending(), [])

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" onClick={() => reviewsApi.approve(String(row.id)).then(reload)}>
        Approve
      </Button>
      <Button size="sm" variant="ghost" onClick={() => reviewsApi.reject(String(row.id)).then(reload)}>
        Reject
      </Button>
    </div>
  ), [])

  return {
    title: 'Review moderation',
    permission: PERMISSIONS.REVIEW_MODERATE,
    load,
    actions,
  }
}
