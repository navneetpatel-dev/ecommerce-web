'use client'

import { useVendorOrderManagement } from '../hooks/useVendorOrderManagement'
import { SkeletonRows } from '@/shared/components/Skeletons'
import { EmptyState } from '@/shared/components/EmptyState'
import { VendorOrdersTable } from '../components/VendorOrdersTable'

export function VendorOrdersPage() {
  const orders = useVendorOrderManagement()

  if (orders.isLoading) return <SkeletonRows count={5} />
  if (!orders.data?.items?.length) return <EmptyState message="No orders to manage" />

  return (
    <VendorOrdersTable
      orders={orders.data.items as any}
      updatingId={orders.updatingId}
      onSetUpdatingId={orders.setUpdatingId}
      onStatusChange={orders.handleStatusChange}
    />
  )
}
