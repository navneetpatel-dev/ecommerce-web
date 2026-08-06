'use client'

import { RequirePermission } from '@/shared/components/RequirePermission'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { VendorReviewsView } from '../components/VendorReviewsView'
import { useVendorReviewsPage } from '../hooks/useVendorReviewsPage'

export function VendorReviewsPage() {
  const { reviews, handleRespond } = useVendorReviewsPage()

  return (
    <RequirePermission permission={PERMISSIONS.REVIEW_RESPOND}>
      <VendorReviewsView reviews={reviews} onRespond={handleRespond} />
    </RequirePermission>
  )
}
