import { RETURN_STATUS, REFUND_STATUS } from '@/shared/constants/statuses'
import { LABELS } from '@/shared/constants/labels'
import type { ReturnRequest } from '@/shared/api/types'
import type { OrderTimelineStep } from '@/features/orders/utils/timeline'

const REFUND_FLOW = [
  REFUND_STATUS.NONE,
  REFUND_STATUS.PENDING,
  REFUND_STATUS.INITIATED,
  REFUND_STATUS.COMPLETED,
] as const

const REFUND_LABELS: Record<string, string> = {
  [REFUND_STATUS.NONE]: LABELS.returnRefundStatusNone,
  [REFUND_STATUS.PENDING]: LABELS.returnRefundStatusPending,
  [REFUND_STATUS.INITIATED]: LABELS.returnRefundStatusInitiated,
  [REFUND_STATUS.COMPLETED]: LABELS.returnRefundStatusCompleted,
  [REFUND_STATUS.FAILED]: LABELS.returnRefundStatusFailed,
}

const LOGISTICS_FLOW = [
  RETURN_STATUS.REQUESTED,
  RETURN_STATUS.APPROVED,
  RETURN_STATUS.PICKUP_SCHEDULED,
  RETURN_STATUS.RECEIVED,
  RETURN_STATUS.CLOSED,
] as const

const LOGISTICS_LABELS: Record<string, string> = {
  [RETURN_STATUS.REQUESTED]: LABELS.returnLogisticsRequested,
  [RETURN_STATUS.APPROVED]: LABELS.returnLogisticsApproved,
  [RETURN_STATUS.PICKUP_SCHEDULED]: LABELS.returnLogisticsPickupScheduled,
  [RETURN_STATUS.RECEIVED]: LABELS.returnLogisticsReceived,
  [RETURN_STATUS.CLOSED]: LABELS.returnLogisticsClosed,
  [RETURN_STATUS.REJECTED]: LABELS.returnLogisticsRejected,
  [RETURN_STATUS.REFUNDED]: LABELS.returnRefundStatusCompleted,
}

function stepStatus(index: number, currentIndex: number): OrderTimelineStep['status'] {
  if (index < currentIndex) return 'completed'
  if (index === currentIndex) return 'current'
  return 'upcoming'
}

export function buildRefundTimeline(row: ReturnRequest): OrderTimelineStep[] {
  const refundStatus = row.refundStatus ?? REFUND_STATUS.NONE

  if (row.status === RETURN_STATUS.REJECTED) {
    return [
      { label: REFUND_LABELS[REFUND_STATUS.NONE], status: 'completed' },
      { label: LABELS.returnLogisticsRejected, status: 'current' },
    ]
  }

  if (refundStatus === REFUND_STATUS.FAILED) {
    return [
      { label: REFUND_LABELS[REFUND_STATUS.PENDING], status: 'completed' },
      { label: REFUND_LABELS[REFUND_STATUS.FAILED], status: 'current' },
    ]
  }

  const idx = REFUND_FLOW.indexOf(refundStatus as (typeof REFUND_FLOW)[number])
  const currentIdx = idx < 0 ? 0 : idx

  return REFUND_FLOW.map((key, i) => ({
    label: REFUND_LABELS[key] ?? key,
    status: stepStatus(i, currentIdx),
    timestamp:
      key === REFUND_STATUS.COMPLETED && row.resolvedAt
        ? new Date(row.resolvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : undefined,
  }))
}

export function buildLogisticsTimeline(row: ReturnRequest): OrderTimelineStep[] {
  if (row.status === RETURN_STATUS.REJECTED) {
    return [
      { label: LOGISTICS_LABELS[RETURN_STATUS.REQUESTED], status: 'completed' },
      { label: LOGISTICS_LABELS[RETURN_STATUS.REJECTED], status: 'current' },
    ]
  }

  const status = row.status
  const idx = LOGISTICS_FLOW.indexOf(status as (typeof LOGISTICS_FLOW)[number])
  const currentIdx = idx < 0 ? 0 : idx

  return LOGISTICS_FLOW.map((key, i) => ({
    label: LOGISTICS_LABELS[key] ?? key,
    status: stepStatus(i, currentIdx),
    timestamp:
      key === RETURN_STATUS.RECEIVED && row.receivedAt
        ? new Date(row.receivedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : undefined,
  }))
}
