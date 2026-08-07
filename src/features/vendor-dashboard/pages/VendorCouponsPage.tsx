'use client'

import { RequirePermission } from '@/shared/components/RequirePermission'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { VendorCouponsView } from '../components/VendorCouponsView'
import { useVendorCouponsPage } from '../hooks/useVendorCouponsPage'

export function VendorCouponsPage() {
  const page = useVendorCouponsPage()

  return (
    <RequirePermission
      permission={[PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_UPDATE]}
    >
      <VendorCouponsView
        coupons={page.coupons}
        loading={page.isLoading}
        pagination={page.pagination}
        open={page.open}
        setOpen={page.setOpen}
        form={page.form}
        isPending={page.isPending}
        onSubmit={page.onSubmit}
        analyticsId={page.analyticsId}
        setAnalyticsId={page.setAnalyticsId}
        analytics={page.analytics}
        analyticsLoading={page.analyticsLoading}
        absorbedDiscountTotal={page.absorbedDiscountTotal}
        onUpdateStatus={page.updateStatus}
      />
    </RequirePermission>
  )
}
