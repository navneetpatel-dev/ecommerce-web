import { Badge } from './ui/badge'

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'secondary'

function getVariant(status: string): BadgeVariant {
  if (status === 'LIVE' || status === 'APPROVED' || status === 'ACTIVE' || status === 'PAID' || status === 'DELIVERED' || status === 'COMPLETED') {
    return 'success'
  }
  if (status === 'PENDING' || status === 'PENDING_APPROVAL' || status === 'DRAFT' || status === 'PROCESSING') {
    return 'warning'
  }
  if (status === 'REJECTED' || status === 'FAILED' || status === 'CANCELLED' || status === 'BLOCKED') {
    return 'destructive'
  }
  return 'secondary'
}

export function StatusBadge({ status }: { status: string }) {
  const variant = getVariant(status)
  return <Badge variant={variant}>{status.replace(/_/g, ' ')}</Badge>
}
