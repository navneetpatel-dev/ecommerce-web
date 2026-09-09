import { LABELS } from '@/shared/constants/labels'

const SKIP_DETAIL_KEYS = new Set([
  'passwordHash',
  'password',
  'token',
  'refreshToken',
  'accessToken',
])

export type RecordDetailField = {
  key: string
  label: string
  value: unknown
}

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function fieldLabel(key: string): string {
  const labels = LABELS as Record<string, string>
  return labels[key] ?? humanizeKey(key)
}

/** Flatten a row into labeled fields for the detail dialog (skips secrets). */
export function buildRecordDetailFields(record: Record<string, unknown>): RecordDetailField[] {
  return Object.keys(record)
    .filter((key) => !SKIP_DETAIL_KEYS.has(key))
    .filter((key) => typeof record[key] !== 'function')
    .map((key) => ({
      key,
      label: fieldLabel(key),
      value: record[key],
    }))
}

/** Best-effort title for the detail dialog. */
export function getRecordDetailTitle(record: Record<string, unknown>): string {
  const candidates = [
    record.businessName,
    record.productName,
    record.customerName,
    record.vendorName,
    record.actorName,
    record.categoryName,
    record.name,
    record.title,
    record.code,
    record.email,
    record.slug,
  ]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
  }
  return LABELS.recordDetails
}
