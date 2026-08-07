import type { AdminDataRow } from '../hooks/useAdminDataList'
import { LABELS } from '@/shared/constants/labels'

/** Best-effort display name for confirm dialogs. */
export function adminRowLabel(row: AdminDataRow): string {
  const value =
    row.businessName ??
    row.productName ??
    row.customerName ??
    row.vendorName ??
    row.categoryName ??
    row.actorName ??
    row.name ??
    row.email ??
    row.code ??
    row.slug ??
    row.title
  return value == null || value === '' ? LABELS.thisItem : String(value)
}
