import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { VendorInfo, VendorDetail } from '@/shared/api/types'
import type {
  VendorDocumentChecklistStatus,
  VendorDocumentType,
  VendorEntityType,
} from '@/shared/constants/statuses'

export type VendorDocument = {
  id: string
  vendorId: string
  type: VendorDocumentType
  url: string
  verified: boolean
  verifiedById?: string | null
  rejectionReason?: string | null
  createdAt?: string
}

export type KycChecklistItem = {
  documentType: VendorDocumentType
  status: VendorDocumentChecklistStatus
  documentId: string | null
  url: string | null
  verified: boolean
  rejectionReason: string | null
  verifiedById: string | null
}

export type KycChecklist = {
  requiredDocumentTypes: VendorDocumentType[]
  items: KycChecklistItem[]
  isComplete: boolean
}

export type VendorRegisterBody = {
  businessName: string
  entityType: VendorEntityType
  categoryIds: string[]
  gstNumber?: string
  description?: string
  bankDetails?: Record<string, unknown>
  panHolderName?: string
  bankAccountHolderName?: string
}

export type VendorRegisterResult = {
  vendor: VendorInfo
  requiredDocumentTypes: VendorDocumentType[]
  checklist: KycChecklistItem[]
  nameMismatchWarning: boolean
}

export const vendorsApi = {
  getById: (id: string) => apiClient.get<VendorDetail & { categoryIds?: string[] }>(API.vendors.detail(id)),
  getBySlug: (slug: string) => apiClient.get<VendorDetail>(API.vendors.bySlug(slug)),
  update: (
    id: string,
    body: {
      businessName?: string
      gstNumber?: string
      description?: string
      logoUrl?: string
      bannerUrl?: string
      returnShippingFee?: number | null
      entityType?: VendorEntityType
      categoryIds?: string[]
    },
  ) => apiClient.patch<VendorInfo>(API.vendors.detail(id), body),
  register: (body: VendorRegisterBody) =>
    apiClient.post<VendorRegisterResult>(API.vendors.register, body),
  previewRequiredDocuments: (entityType: VendorEntityType, categoryIds: string[]) => {
    const params = new URLSearchParams({ entityType })
    if (categoryIds.length) params.set('categoryIds', categoryIds.join(','))
    return apiClient.get<{ requiredDocumentTypes: VendorDocumentType[] }>(
      API.vendors.documentRequirements(params.toString()),
    )
  },
  getDocuments: (vendorId: string) =>
    apiClient.get<VendorDocument[]>(API.vendorDocs.list(vendorId)),
  uploadDocument: (vendorId: string, body: { type: VendorDocumentType; url: string }) =>
    apiClient.post<VendorDocument>(API.vendorDocs.create(vendorId), body),
  getMyDocuments: () => apiClient.get<VendorDocument[]>(API.vendorDocs.meList),
  uploadMyDocument: (body: { type: VendorDocumentType; url: string }) =>
    apiClient.post<VendorDocument>(API.vendorDocs.meCreate, body),
  getMyKycChecklist: () => apiClient.get<KycChecklist>(API.vendors.meKycChecklist),
  getKycChecklist: (vendorId: string) =>
    apiClient.get<KycChecklist>(API.vendors.kycChecklist(vendorId)),
  verifyDocument: (documentId: string) =>
    apiClient.patch(API.vendorDocs.verify(documentId), {}),
  rejectDocument: (documentId: string, reason: string) =>
    apiClient.patch<{ id: string; rejected: boolean; rejectionReason: string }>(
      API.vendorDocs.reject(documentId),
      { reason },
    ),
  getDocumentViewUrl: (documentId: string) =>
    apiClient.get<{ url: string }>(API.vendorDocs.viewUrl(documentId)),
}
