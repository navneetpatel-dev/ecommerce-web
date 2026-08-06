import { cn } from '@/shared/utils/cn'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { ORDER_STATUS, PAYMENT_STATUS } from '@/shared/constants/statuses'

type Density = 'compact' | 'comfortable'

interface OrderStatusGroupProps {
  orderStatus: string
  paymentStatus?: string | null
  density?: Density
  className?: string
}

const ORDER_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
}

const PAYMENT_LABELS_COMPACT: Record<string, string> = {
  PENDING: 'Unpaid',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
}

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: 'Awaiting payment',
  PAID: 'Paid',
  FAILED: 'Payment failed',
  REFUNDED: 'Refunded',
}

type Tone = 'neutral' | 'progress' | 'positive' | 'caution' | 'danger'

function orderTone(status: string): Tone {
  const key = status.toUpperCase()
  if (key === ORDER_STATUS.DELIVERED || key === ORDER_STATUS.CONFIRMED) return 'positive'
  if (key === ORDER_STATUS.SHIPPED) return 'progress'
  if (key === ORDER_STATUS.PENDING) return 'caution'
  if (key === ORDER_STATUS.CANCELLED || key === ORDER_STATUS.RETURNED) return 'danger'
  return 'neutral'
}

function paymentTone(status: string): Tone {
  const key = status.toUpperCase()
  if (key === PAYMENT_STATUS.PAID) return 'positive'
  if (key === PAYMENT_STATUS.PENDING) return 'caution'
  if (key === PAYMENT_STATUS.FAILED || key === PAYMENT_STATUS.REFUNDED) return 'danger'
  return 'neutral'
}

const TONE_CLASS: Record<Tone, string> = {
  neutral: 'text-ink-muted',
  progress: 'text-brand',
  positive: 'text-success',
  caution: 'text-warning',
  danger: 'text-danger',
}

const DOT_CLASS: Record<Tone, string> = {
  neutral: 'bg-ink-faint',
  progress: 'bg-brand',
  positive: 'bg-success',
  caution: 'bg-warning',
  danger: 'bg-danger',
}

function displayLabel(kind: 'order' | 'payment', status: string, density: Density) {
  const key = status.toUpperCase()
  if (kind === 'payment') {
    const map = density === 'compact' ? PAYMENT_LABELS_COMPACT : PAYMENT_LABELS
    return map[key] ?? status.replace(/_/g, ' ')
  }
  return ORDER_LABELS[key] ?? status.replace(/_/g, ' ')
}

function CompactStatusLine({
  kind,
  status,
  label,
}: {
  kind: 'order' | 'payment'
  status: string
  label: string
}) {
  const tone = kind === 'order' ? orderTone(status) : paymentTone(status)
  const field = kind === 'order' ? 'Order' : 'Payment'

  return (
    <div
      className="inline-flex items-center gap-2 text-[0.75rem] leading-none"
      title={`${field}: ${label}`}
    >
      <span className="w-12 shrink-0 text-[0.625rem] font-medium uppercase tracking-[0.06em] text-ink-faint">
        {field}
      </span>
      <span className={cn('inline-flex items-center gap-1.5', TONE_CLASS[tone])}>
        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', DOT_CLASS[tone])} aria-hidden />
        <span className="font-medium tracking-tight">{label}</span>
      </span>
    </div>
  )
}

/** Clearly separates fulfillment vs payment — never two unlabeled identical badges. */
export function OrderStatusGroup({
  orderStatus,
  paymentStatus,
  density = 'comfortable',
  className,
}: OrderStatusGroupProps) {
  const orderLabel = displayLabel('order', orderStatus, density)
  const paymentLabel = paymentStatus
    ? displayLabel('payment', paymentStatus, density)
    : null

  if (density === 'compact') {
    return (
      <div
        className={cn('flex flex-col gap-1.5', className)}
        role="group"
        aria-label="Order and payment status"
      >
        <CompactStatusLine kind="order" status={orderStatus} label={orderLabel} />
        {paymentStatus && paymentLabel ? (
          <CompactStatusLine kind="payment" status={paymentStatus} label={paymentLabel} />
        ) : null}
      </div>
    )
  }

  return (
    <div
      className={cn('flex flex-wrap items-start gap-5', className)}
      role="group"
      aria-label="Order and payment status"
    >
      <div className="min-w-[8.5rem]">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
          Order
        </p>
        <div className="mt-1.5">
          <StatusBadge
            status={orderStatus}
            label={orderLabel}
            className="px-1.5 py-0.5 text-[0.6875rem] font-medium"
          />
        </div>
      </div>
      {paymentStatus && paymentLabel ? (
        <div className="min-w-[8.5rem]">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            Payment
          </p>
          <div className="mt-1.5">
            <StatusBadge
              status={paymentStatus}
              label={paymentLabel}
              className="px-1.5 py-0.5 text-[0.6875rem] font-medium"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
