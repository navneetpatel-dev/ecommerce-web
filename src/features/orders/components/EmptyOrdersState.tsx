import { EmptyState } from '@/shared/components/EmptyState'

export function EmptyOrdersState() {
  return (
    <EmptyState
      message="No orders yet"
      actionLabel="Start shopping"
      actionTo="/"
    />
  )
}
