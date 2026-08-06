import type { AdminDataRow } from '../hooks/useAdminDataList'
import { LABELS } from '@/shared/constants/labels'

/** Best-effort display name for confirm dialogs. */
export function adminRowLabel(row: AdminDataRow): string {
  const value =
    row.businessName ??
    row.name ??
    row.email ??
    row.code ??
    row.slug ??
    row.id
  return value == null || value === '' ? LABELS.thisItem : String(value)
}
