/** Detect API/ISO datetime strings (and YYYY-MM-DD dates). */
export function isDateLikeString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return false
  return !Number.isNaN(Date.parse(value))
}

/** Readable date + time for admin tables and detail views. */
export function formatDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Format when the value looks like a date; otherwise return null. */
export function tryFormatDateTime(value: unknown): string | null {
  if (value instanceof Date) return formatDateTime(value)
  if (typeof value === 'string' && isDateLikeString(value)) return formatDateTime(value)
  return null
}
