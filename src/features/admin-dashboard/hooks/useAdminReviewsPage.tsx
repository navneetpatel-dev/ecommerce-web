'use client'

import { useCallback, type ReactNode } from 'react'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { reviewsApi } from '@/features/reviews/api/reviews.api'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import { adminRowLabel } from '../utils/adminRowLabel'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export function useAdminReviewsPage(): AdminListPageModel {
  const load = useCallback(async () => reviewsApi.pending(), [])

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => {
    const name = adminRowLabel(row)
    return (
      <>
        <AdminConfirmAction
          label={LABELS.approve}
          dialogVariant="success"
          title={LABELS.confirmApproveReviewTitle}
          description={formatLabel(LABELS.confirmApproveReviewBody, { name })}
          onConfirm={() => reviewsApi.approve(String(row.id)).then(reload)}
        />
        <AdminConfirmAction
          label={LABELS.reject}
          dialogVariant="danger"
          title={LABELS.confirmRejectReviewTitle}
          description={formatLabel(LABELS.confirmRejectReviewBody, { name })}
          onConfirm={() => reviewsApi.reject(String(row.id)).then(reload)}
        />
      </>
    )
  }, [])

  return {
    title: LABELS.reviews,
    permission: PERMISSIONS.REVIEW_MODERATE,
    load,
    actions,
  }
}
