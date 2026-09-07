/** Frontend vendor API path builders — must stay aligned with backend mounts under `/api`. */
export const vendorsRoutes = {
  list: (query = "") => `/api/vendors${query ? `?${query}` : ""}`,
  directory: (query = "") =>
    `/api/vendors/directory${query ? `?${query}` : ""}`,
  storefront: (query = "") =>
    `/api/vendors/storefront${query ? `?${query}` : ""}`,
  detail: (id: string) => `/api/vendors/${id}`,
  bySlug: (slug: string) => `/api/vendors/slug/${slug}`,
  me: "/api/vendors/me",
  approve: (id: string) => `/api/vendors/${id}/approve`,
  reject: (id: string) => `/api/vendors/${id}/reject`,
  suspend: (id: string) => `/api/vendors/${id}/suspend`,
  unsuspend: (id: string) => `/api/vendors/${id}/unsuspend`,
  delete: (id: string) => `/api/vendors/${id}`,
  dashboardSummary: "/api/vendors/dashboard/summary",
  dashboardAnalytics: "/api/vendors/dashboard/analytics",
  register: "/api/vendors/register",
  documentRequirements: (query = "") =>
    `/api/vendors/document-requirements${query ? `?${query}` : ""}`,
  meKycChecklist: "/api/vendors/me/kyc-checklist",
  kycChecklist: (id: string) => `/api/vendors/${id}/kyc-checklist`,
} as const;

export const vendorDocsRoutes = {
  list: (vendorId: string) => `/api/vendors/${vendorId}/documents`,
  create: (vendorId: string) => `/api/vendors/${vendorId}/documents`,
  meList: "/api/vendors/me/documents",
  meCreate: "/api/vendors/me/documents",
  verify: (documentId: string) => `/api/vendors/documents/${documentId}/verify`,
  reject: (documentId: string) => `/api/vendors/documents/${documentId}/reject`,
  viewUrl: (documentId: string) =>
    `/api/vendors/documents/${documentId}/view-url`,
} as const;
