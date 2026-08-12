import { ORDER_STATUS } from '@/shared/constants/statuses'
import type { SubOrder } from '@/shared/api/types'

type TimelineStatus = 'completed' | 'current' | 'upcoming'

export interface OrderTimelineStep {
  label: string
  timestamp?: string
  status: TimelineStatus
}

const FLOW = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
] as const

export const STEP_LABELS: Record<string, string> = {
  [ORDER_STATUS.PENDING]: 'Order placed',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.RETURNED]: 'Returned',
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

export function buildSubOrderTimeline(subOrder: SubOrder): OrderTimelineStep[] {
  const status = subOrder.status

  if (status === ORDER_STATUS.CANCELLED || status === ORDER_STATUS.RETURNED) {
    return [
      { label: STEP_LABELS[ORDER_STATUS.PENDING], status: 'completed' },
      { label: STEP_LABELS[status] ?? status, status: 'current' },
    ]
  }

  const idx = FLOW.indexOf(status as (typeof FLOW)[number])
  const currentIdx = idx < 0 ? 0 : idx

  return FLOW.map((key, i) => {
    let stepStatus: TimelineStatus = 'upcoming'
    if (i < currentIdx) stepStatus = 'completed'
    else if (i === currentIdx) stepStatus = 'current'

    let timestamp: string | undefined
    if (key === ORDER_STATUS.SHIPPED && subOrder.shipment?.shippedAt) {
      timestamp = formatShortDate(subOrder.shipment.shippedAt)
    }
    if (key === ORDER_STATUS.DELIVERED && subOrder.shipment?.deliveredAt) {
      timestamp = formatShortDate(subOrder.shipment.deliveredAt)
    }

    return {
      label: STEP_LABELS[key] ?? key,
      status: stepStatus,
      timestamp,
    }
  })
}
