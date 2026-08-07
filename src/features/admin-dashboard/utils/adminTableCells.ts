import { LABELS } from '@/shared/constants/labels'
import { tryFormatDateTime } from '@/shared/utils/formatDate'
import type { AdminDataRow } from '../hooks/useAdminDataList'

const SKIP_COLUMN_KEYS = new Set([
  'id',
  'bankDetails',
  'passwordHash',
  'createdBy',
  'updatedBy',
  'deletedBy',
  'deletedAt',
  'metadata',
])

function isIdLikeKey(key: string): boolean {
  return key === 'id' || key.endsWith('Id')
}

/** Resolve `a.b.c` paths on admin list rows. */
export function getAdminCellValue(row: AdminDataRow, key: string): unknown {
  if (!key.includes('.')) return row[key]
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[part]
  }, row)
}

/** Prefer human labels over UUIDs / nested association dumps. */
export function formatAdminCellValue(value: unknown): string {
  if (value == null || value === '') return '—'
  const asDate = tryFormatDateTime(value)
  if (asDate) return asDate
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.businessName === 'string' && obj.businessName.trim()) return obj.businessName
    if (typeof obj.name === 'string' && obj.name.trim()) return obj.name
    if (typeof obj.email === 'string' && obj.email.trim()) return obj.email
    if (typeof obj.code === 'string' && obj.code.trim()) return obj.code
    if (Array.isArray(value)) {
      if (value.length === 0) return '—'
      return value
        .map((item) => formatAdminCellValue(item))
        .filter((item) => item !== '—')
        .join(', ')
    }
    return '—'
  }
  if (typeof value === 'boolean') return value ? LABELS.yes : LABELS.no
  return String(value)
}

export function shouldInferAdminColumn(key: string): boolean {
  if (SKIP_COLUMN_KEYS.has(key)) return false
  if (isIdLikeKey(key)) return false
  return true
}
