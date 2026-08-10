import { LABELS } from '@/shared/constants/labels'
import {
  VENDOR_DOCUMENT_CHECKLIST_STATUS,
  type VendorDocumentChecklistStatus,
} from '@/shared/constants/statuses'

export function vendorDocumentChecklistStatusLabel(status: VendorDocumentChecklistStatus): string {
  switch (status) {
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.NOT_UPLOADED:
      return LABELS.documentNotUploaded
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.PENDING_REVIEW:
      return LABELS.documentPending
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.VERIFIED:
      return LABELS.documentVerified
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.REJECTED:
      return LABELS.documentRejected
    default:
      return status
  }
}
