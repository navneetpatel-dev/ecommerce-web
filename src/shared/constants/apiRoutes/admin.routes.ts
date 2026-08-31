/** Frontend admin/platform API path builders — must stay aligned with backend mounts under `/api`. */
export const adminRoutes = {
  dashboard: "/api/admin/dashboard",
  analytics: "/api/admin/analytics/platform",
} as const;

export const auditRoutes = {
  list: "/api/audit",
} as const;

export const reportsRoutes = {
  catalog: "/api/reports/catalog",
  run: (type: string, query = "") =>
    `/api/reports/run/${encodeURIComponent(type)}${query ? `?${query}` : ""}`,
  exportDownload: (id: string) => `/api/reports/exports/${id}/download`,
  exportStatus: (id: string) => `/api/reports/exports/${id}`,
  customerOrderHistory: (query = "") =>
    `/api/reports/customer/order-history${query ? `?${query}` : ""}`,
  customerOrderInvoice: (orderId: string) =>
    `/api/reports/customer/order-invoice/${orderId}`,
  customerOrderSubInvoice: (orderId: string, subOrderId: string) =>
    `/api/reports/customer/order-invoice/${orderId}/${subOrderId}`,
  vendorSubOrderInvoice: (subOrderId: string) =>
    `/api/reports/vendor/sub-orders/${subOrderId}/invoice`,
  adminSummary: "/api/reports/admin/summary",
  adminVendors: "/api/reports/admin/vendors",
  adminReconciliation: "/api/reports/admin/reconciliation",
  adminWalletLiability: "/api/reports/admin/wallet-liability",
  adminCashbackWriteOffs: "/api/reports/admin/cashback-write-offs",
  vendor: (vendorId: string) => `/api/reports/vendor/${vendorId}`,
} as const;

export const settingsRoutes = {
  public: "/api/settings/public",
  root: "/api/settings",
} as const;

export const homepageRoutes = {
  banners: "/api/homepage/banners",
  adminBanners: "/api/homepage/admin/banners",
  adminBanner: (id: string) => `/api/homepage/admin/banners/${id}`,
} as const;

export const notificationsRoutes = {
  logs: "/api/notifications/logs",
  test: "/api/notifications/test",
} as const;

export const inventoryRoutes = {
  lowStock: "/api/inventory/low-stock",
  variantStock: (variantId: string) =>
    `/api/inventory/variants/${variantId}/stock`,
} as const;

export const uploadsRoutes = {
  root: "/api/uploads",
  bulk: "/api/uploads/bulk",
  presign: "/api/uploads/presign",
  presignBulk: "/api/uploads/presign/bulk",
} as const;
