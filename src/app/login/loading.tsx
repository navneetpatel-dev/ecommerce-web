import { ContentPageSkeleton } from '@/shared/components/Skeletons'

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-paper">
      <ContentPageSkeleton />
    </div>
  )
}
