import { SkeletonGrid } from '@/shared/components/Skeletons'

export default function ProductsLoading() {
  return (
    <div className="space-y-6 p-6">
      <SkeletonGrid count={8} />
    </div>
  )
}
