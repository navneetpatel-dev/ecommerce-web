'use client'
import { useVendorSummary } from '../api/vendor.queries'
import { ProductsTable } from './ProductsTable'
import { VendorSummaryGrid } from '../components/VendorSummaryGrid'
import { SkeletonGrid } from '@/shared/components/Skeletons'

export function VendorOverview() {
  const { data: summary, isLoading } = useVendorSummary()

  if (isLoading) return <SkeletonGrid count={4} aspect="h-24" />

  return (
    <div className="space-y-8">
      <VendorSummaryGrid summary={summary} />
      <ProductsTable />
    </div>
  )
}
