import { Badge } from './ui/badge'

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'secondary' | 'brand'

function getVariant(status: string): BadgeVariant {
  const normalized = status.toUpperCase()

  if (
    normalized === 'LIVE' ||
    normalized === 'APPROVED' ||
    normalized === 'ACTIVE' ||
    normalized === 'PAID' ||
    normalized === 'DELIVERED' ||
    normalized === 'COMPLETED' ||
    normalized === 'CONFIRMED'
  ) {
    return 'success'
  }

  if (
    normalized === 'SHIPPED' ||
    normalized === 'PICKED_UP' ||
    normalized === 'IN_TRANSIT' ||
    normalized === 'OUT_FOR_DELIVERY' ||
    normalized === 'PROCESSING'
  ) {
    return 'brand'
  }

  if (
    normalized === 'PENDING' ||
    normalized === 'PENDING_APPROVAL' ||
    normalized === 'DRAFT' ||
    normalized === 'RETURNED'
  ) {
    return 'warning'
  }

  if (
    normalized === 'REJECTED' ||
    normalized === 'FAILED' ||
    normalized === 'CANCELLED' ||
    normalized === 'BLOCKED' ||
    normalized === 'REFUNDED'
  ) {
    return 'destructive'
  }

  return 'secondary'
}

interface StatusBadgeProps {
  status: string
  /** Override visible text (status still drives color). */
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = getVariant(status)
  return (
    <Badge variant={variant} className={className}>
      {label ?? status.replace(/_/g, ' ')}
    </Badge>
  )
}
