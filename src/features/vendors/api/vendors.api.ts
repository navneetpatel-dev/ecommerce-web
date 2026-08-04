import { apiClient } from '@/shared/api/client'
import type { VendorInfo } from '@/shared/api/types'

export const vendorsApi = {
  getById: (id: string) => apiClient.get<VendorInfo>(`/api/vendors/${id}`),
  update: (id: string, body: { businessName?: string; gstNumber?: string; description?: string; logoUrl?: string; bannerUrl?: string }) =>
    apiClient.patch<VendorInfo>(`/api/vendors/${id}`, body),
  register: (body: { businessName: string; gstNumber?: string; description?: string; bankDetails?: Record<string, unknown> }) =>
    apiClient.post<VendorInfo>('/api/vendors/register', body),
  getDocuments: (vendorId: string) =>
    apiClient.get<unknown[]>(`/api/vendors/${vendorId}/documents`),
  uploadDocument: (vendorId: string, body: unknown) =>
    apiClient.post(`/api/vendors/${vendorId}/documents`, body),
  verifyDocument: (documentId: string) =>
    apiClient.patch(`/api/vendors/documents/${documentId}/verify`, {}),
}
