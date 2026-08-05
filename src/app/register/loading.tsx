import { ContentPageSkeleton } from '@/shared/components/Skeletons'

export default function RegisterLoading() {
  return (
    <div className="min-h-screen bg-paper">
      <ContentPageSkeleton />
    </div>
  )
}
