export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === 'LIVE' || status === 'APPROVED' || status === 'ACTIVE' || status === 'PAID' || status === 'DELIVERED' || status === 'COMPLETED'
      ? 'success' as const
      : status === 'PENDING' || status === 'PENDING_APPROVAL' || status === 'DRAFT' || status === 'PROCESSING'
      ? 'secondary' as const
      : status === 'REJECTED' || status === 'FAILED' || status === 'CANCELLED' || status === 'BLOCKED'
      ? 'destructive' as const
      : 'outline-solid' as const

  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
      variant === 'success' ? 'border-transparent bg-success/10 text-success' :
      variant === 'secondary' ? 'border-transparent bg-paper text-ink' :
      variant === 'destructive' ? 'border-transparent bg-danger/10 text-danger' :
      'border-line text-ink'
    }`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
