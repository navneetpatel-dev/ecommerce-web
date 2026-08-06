/** Format INR for storefront display (Inter + tabular-nums — not mono). */
export function formatInr(value: number) {
  return `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

export function formatOrderDate(value: string | Date) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function shortOrderId(id: string) {
  return id.slice(0, 8)
}

export function countOrderItems(order: { subOrders?: Array<{ items?: unknown[] }> }) {
  return (order.subOrders ?? []).reduce((sum, so) => sum + (so.items?.length ?? 0), 0)
}

export function orderItemSummary(order: {
  subOrders?: Array<{ items?: Array<{ productName?: string }> }>
}) {
  const names = (order.subOrders ?? [])
    .flatMap((so) => so.items ?? [])
    .map((item) => item.productName)
    .filter(Boolean) as string[]

  if (names.length === 0) return 'No items'
  if (names.length === 1) return names[0]!
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names[0]} and ${names.length - 1} more`
}
