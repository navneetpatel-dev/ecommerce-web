import type { SubOrder } from '@/shared/api/types'

type TimelineStatus = 'completed' | 'current' | 'upcoming'

export interface OrderTimelineStep {
  label: string
  timestamp?: string
  status: TimelineStatus
}

const FLOW = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'] as const

const LABELS: Record<string, string> = {
  PENDING: 'Order placed',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

export function buildSubOrderTimeline(subOrder: SubOrder): OrderTimelineStep[] {
  const status = subOrder.status

  if (status === 'CANCELLED' || status === 'RETURNED') {
    return [
      { label: LABELS.PENDING, status: 'completed' },
      { label: LABELS[status] ?? status, status: 'current' },
    ]
  }

  const idx = FLOW.indexOf(status as (typeof FLOW)[number])
  const currentIdx = idx < 0 ? 0 : idx

  return FLOW.map((key, i) => {
    let stepStatus: TimelineStatus = 'upcoming'
    if (i < currentIdx) stepStatus = 'completed'
    else if (i === currentIdx) stepStatus = 'current'

    let timestamp: string | undefined
    if (key === 'SHIPPED' && subOrder.shipment?.shippedAt) {
      timestamp = formatShortDate(subOrder.shipment.shippedAt)
    }
    if (key === 'DELIVERED' && subOrder.shipment?.deliveredAt) {
      timestamp = formatShortDate(subOrder.shipment.deliveredAt)
    }

    return {
      label: LABELS[key] ?? key,
      status: stepStatus,
      timestamp,
    }
  })
}
