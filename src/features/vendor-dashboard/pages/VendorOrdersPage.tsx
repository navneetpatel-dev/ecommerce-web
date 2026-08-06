'use client'

import { useVendorOrderManagement } from '../hooks/useVendorOrderManagement'
import { SkeletonRows } from '@/shared/components/Skeletons'
import { EmptyState } from '@/shared/components/EmptyState'
import { VendorOrdersTable } from '../components/VendorOrdersTable'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { PERMISSIONS } from '@/shared/constants/permissions'

export function VendorOrdersPage() {
  const orders = useVendorOrderManagement()

  if (orders.isLoading) return <SkeletonRows count={5} />
  if (!orders.data?.items?.length) return <EmptyState message="No orders to manage" />

  return (
    <RequirePermission permission={PERMISSIONS.SUBORDER_MANAGE}>
      <VendorOrdersTable
        orders={orders.data.items as any}
        updatingId={orders.updatingId}
        onSetUpdatingId={orders.setUpdatingId}
        onStatusChange={orders.handleStatusChange}
      />
    </RequirePermission>
  )
}
