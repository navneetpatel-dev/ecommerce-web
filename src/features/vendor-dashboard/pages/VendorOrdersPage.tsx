'use client'
import { useVendorOrderManagement } from '../hooks/useVendorOrderManagement'
import { SkeletonRows } from '@/shared/components/Skeletons'
import { EmptyState } from '@/shared/components/EmptyState'
import { VendorOrdersTable } from '../components/VendorOrdersTable'

export function VendorOrdersPage() {
  const { data, isLoading, updatingId, setUpdatingId, handleStatusChange } = useVendorOrderManagement()

  if (isLoading) return <SkeletonRows count={5} />
  if (!data?.items?.length) return <EmptyState message="No orders to manage" />

  return (
    <VendorOrdersTable
      orders={data.items as any}
      updatingId={updatingId}
      onSetUpdatingId={setUpdatingId}
      onStatusChange={handleStatusChange}
    />
  )
}
