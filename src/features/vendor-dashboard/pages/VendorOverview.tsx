'use client'

import { useVendorOverview } from '../hooks/useVendorOverview'
import { ProductsTable } from './ProductsTable'
import { VendorSummaryGrid } from '../components/VendorSummaryGrid'
import { SkeletonGrid } from '@/shared/components/Skeletons'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { VENDOR_NAV } from '@/shared/constants/vendorNav'

export function VendorOverview() {
  const overview = useVendorOverview()

  if (overview.isLoading) return <SkeletonGrid count={4} aspect="h-24" />

  return (
    <RequirePermission permission={VENDOR_NAV[0].permissions}>
      <div className="space-y-8">
        <VendorSummaryGrid summary={overview.summary} />
        <ProductsTable />
      </div>
    </RequirePermission>
  )
}
