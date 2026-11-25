/** Frontend admin/platform API path builders — must stay aligned with backend mounts under `/api`. */
export const adminRoutes = {
  dashboard: "/api/admin/dashboard",
  analytics: "/api/admin/analytics/platform",
  analyticsExport: (query = "") =>
    `/api/admin/analytics/platform/export${query ? `?${query}` : ""}`,
} as const;

export const auditRoutes = {
  list: "/api/audit",
} as const;

export const reportsRoutes = {
  catalog: "/api/reports/catalog",
  run: (type: string, query = "") =>
    `/api/reports/run/${encodeURIComponent(type)}${query ? `?${query}` : ""}`,
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
  adminWalletRecharge: "/api/reports/admin/wallet-recharge",
  adminCashbackWriteOffs: "/api/reports/admin/cashback-write-offs",
  /** Vendor settlement summary — BE route: GET /api/reports/vendor/:vendorId/summary. */
  vendor: (vendorId: string) => `/api/reports/vendor/${vendorId}/summary`,
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
  broadcast: "/api/notifications/broadcast",
  broadcastPreview: "/api/notifications/broadcast/preview",
  broadcastRenderPreview: "/api/notifications/broadcast/render-preview",
  broadcastTest: "/api/notifications/broadcast/test",
  broadcasts: "/api/notifications/broadcasts",
  broadcastCancel: (id: string) =>
    `/api/notifications/broadcasts/${encodeURIComponent(id)}/cancel`,
  broadcastUsers: (q: string, page = 1, limit = 20) =>
    `/api/notifications/broadcast-users?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
  broadcastCategories: (q: string, page = 1, limit = 20) =>
    `/api/notifications/broadcast-categories?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
  broadcastLocations: (
    field: "state" | "city",
    q: string,
    page = 1,
    limit = 20,
  ) =>
    `/api/notifications/broadcast-locations?field=${field}&q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
  inApp: "/api/notifications/in-app",
  inAppRead: (id: string) =>
    `/api/notifications/in-app/${encodeURIComponent(id)}/read`,
  inAppReadAll: "/api/notifications/in-app/read-all",
  pushPublicKey: "/api/notifications/push/public-key",
  pushSubscribe: "/api/notifications/push/subscribe",
  unsubscribe: "/api/notifications/unsubscribe",
  health: "/api/notifications/health",
  resend: (id: string) =>
    `/api/notifications/logs/${encodeURIComponent(id)}/resend`,
  bulkResendPreview: "/api/notifications/logs/bulk-resend/preview",
  bulkResend: "/api/notifications/logs/bulk-resend",
  broadcastRetryFailed: (id: string) =>
    `/api/notifications/broadcasts/${encodeURIComponent(id)}/retry-failed`,
  broadcastSendTest: (id: string) =>
    `/api/notifications/broadcasts/${encodeURIComponent(id)}/send-test`,
  suppressions: (search: string, page = 1, limit = 25) =>
    `/api/notifications/suppressions?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
  suppressionsClear: "/api/notifications/suppressions/clear",
  templates: "/api/notifications/templates",
  templatePreview: (type: string, theme: "light" | "dark") =>
    `/api/notifications/templates/${encodeURIComponent(type)}/preview?theme=${theme}`,
  templateTest: (type: string) =>
    `/api/notifications/templates/${encodeURIComponent(type)}/test`,
} as const;

export const inventoryRoutes = {
  lowStock: "/api/inventory/low-stock",
  variantStock: (variantId: string) =>
    `/api/inventory/variants/${variantId}/stock`,
  stockAlerts: "/api/inventory/stock-alerts",
  stockAlert: (id: string) => `/api/inventory/stock-alerts/${id}`,
} as const;

export const uploadsRoutes = {
  root: "/api/uploads",
  bulk: "/api/uploads/bulk",
  presign: "/api/uploads/presign",
  presignBulk: "/api/uploads/presign/bulk",
  verify: "/api/uploads/verify",
} as const;
