import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { VendorInfo, VendorDetail } from '@/shared/api/types'

export type VendorDocumentType = 'GST_CERT' | 'PAN' | 'BANK_PROOF'

export type VendorDocument = {
  id: string
  vendorId: string
  type: VendorDocumentType
  url: string
  verified: boolean
  createdAt?: string
}

export const vendorsApi = {
  getById: (id: string) => apiClient.get<VendorDetail>(API.vendors.detail(id)),
  getBySlug: (slug: string) => apiClient.get<VendorDetail>(API.vendors.bySlug(slug)),
  update: (id: string, body: { businessName?: string; gstNumber?: string; description?: string; logoUrl?: string; bannerUrl?: string }) =>
    apiClient.patch<VendorInfo>(API.vendors.detail(id), body),
  register: (body: { businessName: string; gstNumber?: string; description?: string; bankDetails?: Record<string, unknown> }) =>
    apiClient.post<VendorInfo>(API.vendors.register, body),
  getDocuments: (vendorId: string) =>
    apiClient.get<VendorDocument[]>(API.vendorDocs.list(vendorId)),
  uploadDocument: (vendorId: string, body: unknown) =>
    apiClient.post(API.vendorDocs.create(vendorId), body),
  verifyDocument: (documentId: string) =>
    apiClient.patch(API.vendorDocs.verify(documentId), {}),
  rejectDocument: (documentId: string, reason: string) =>
    apiClient.patch<{ id: string; rejected: boolean }>(API.vendorDocs.reject(documentId), {
      reason,
    }),
}
