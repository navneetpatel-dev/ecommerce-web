import { Badge } from './ui/badge'
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PRODUCT_STATUS,
  VENDOR_STATUS,
  USER_STATUS,
  SHIPMENT_STATUS,
  REVIEW_STATUS,
  CATEGORY_STATUS,
} from '@/shared/constants/statuses'

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'secondary' | 'brand'

const SUCCESS = new Set<string>([
  PRODUCT_STATUS.LIVE,
  VENDOR_STATUS.APPROVED,
  REVIEW_STATUS.APPROVED,
  USER_STATUS.ACTIVE,
  PAYMENT_STATUS.PAID,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CONFIRMED,
  CATEGORY_STATUS.ACTIVE,
  'COMPLETED',
])

const BRAND = new Set<string>([
  ORDER_STATUS.SHIPPED,
  SHIPMENT_STATUS.PICKED_UP,
  SHIPMENT_STATUS.IN_TRANSIT,
  SHIPMENT_STATUS.OUT_FOR_DELIVERY,
  'PROCESSING',
])

const WARNING = new Set<string>([
  ORDER_STATUS.PENDING,
  PRODUCT_STATUS.PENDING_APPROVAL,
  PRODUCT_STATUS.DRAFT,
  ORDER_STATUS.RETURNED,
  REVIEW_STATUS.PENDING,
  VENDOR_STATUS.PENDING,
  PAYMENT_STATUS.PENDING,
])

const DESTRUCTIVE = new Set<string>([
  VENDOR_STATUS.REJECTED,
  REVIEW_STATUS.REJECTED,
  PRODUCT_STATUS.REJECTED,
  PAYMENT_STATUS.FAILED,
  ORDER_STATUS.CANCELLED,
  USER_STATUS.BLOCKED,
  PAYMENT_STATUS.REFUNDED,
  CATEGORY_STATUS.ARCHIVED,
])

function getVariant(status: string): BadgeVariant {
  const normalized = status.toUpperCase()
  if (SUCCESS.has(normalized)) return 'success'
  if (BRAND.has(normalized)) return 'brand'
  if (WARNING.has(normalized)) return 'warning'
  if (DESTRUCTIVE.has(normalized)) return 'destructive'
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
