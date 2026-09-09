import { LABELS } from '@/shared/constants/labels'
import { VENDOR_DOCUMENT_TYPE, type VendorDocumentType } from '@/shared/constants/statuses'

const DOCUMENT_TYPE_LABELS: Record<VendorDocumentType, string> = {
  [VENDOR_DOCUMENT_TYPE.GST_CERT]: LABELS.documentTypeGst,
  [VENDOR_DOCUMENT_TYPE.PAN]: LABELS.documentTypePan,
  [VENDOR_DOCUMENT_TYPE.AADHAAR]: LABELS.documentTypeAadhaar,
  [VENDOR_DOCUMENT_TYPE.BANK_PROOF]: LABELS.documentTypeBank,
  [VENDOR_DOCUMENT_TYPE.ADDRESS_PROOF]: LABELS.documentTypeAddressProof,
  [VENDOR_DOCUMENT_TYPE.INCORPORATION_CERT]: LABELS.documentTypeIncorporationCert,
  [VENDOR_DOCUMENT_TYPE.PARTNERSHIP_DEED]: LABELS.documentTypePartnershipDeed,
  [VENDOR_DOCUMENT_TYPE.AUTHORIZED_SIGNATORY_ID]: LABELS.documentTypeAuthorizedSignatoryId,
  [VENDOR_DOCUMENT_TYPE.FSSAI_LICENSE]: LABELS.documentTypeFssaiLicense,
  [VENDOR_DOCUMENT_TYPE.CATEGORY_TRADE_LICENSE]: LABELS.documentTypeCategoryTradeLicense,
}

export function vendorDocumentTypeLabel(type: string): string {
  if (type in DOCUMENT_TYPE_LABELS) {
    return DOCUMENT_TYPE_LABELS[type as VendorDocumentType]
  }
  return LABELS.documentType
}
