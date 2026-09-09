import { LABELS } from '@/shared/constants/labels'
import { VENDOR_ENTITY_TYPE, type VendorEntityType } from '@/shared/constants/statuses'

const ENTITY_TYPE_LABELS: Record<VendorEntityType, string> = {
  [VENDOR_ENTITY_TYPE.SOLE_PROPRIETORSHIP]: LABELS.entityTypeSole,
  [VENDOR_ENTITY_TYPE.PARTNERSHIP]: LABELS.entityTypePartnership,
  [VENDOR_ENTITY_TYPE.LLP]: LABELS.entityTypeLlp,
  [VENDOR_ENTITY_TYPE.PRIVATE_LIMITED]: LABELS.entityTypePrivateLimited,
}

export function vendorEntityTypeLabel(type: string): string {
  if (type in ENTITY_TYPE_LABELS) {
    return ENTITY_TYPE_LABELS[type as VendorEntityType]
  }
  return LABELS.entityType
}
