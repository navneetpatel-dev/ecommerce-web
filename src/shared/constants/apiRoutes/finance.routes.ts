/** Frontend finance API path builders — must stay aligned with backend mounts under `/api`. */
export const walletRoutes = {
  balance: "/api/wallet/balance",
  transactions: "/api/wallet/transactions",
  statement: (query = "") =>
    `/api/wallet/statement${query ? `?${query}` : ""}`,
} as const;

export const commissionsRoutes = {
  list: "/api/commissions",
  invoices: "/api/commissions/invoices",
  invoicePdf: (invoiceId: string) => `/api/commissions/invoices/${invoiceId}/pdf`,
  vendor: (vendorId: string) => `/api/commissions/vendor/${vendorId}`,
} as const;

export const payoutsRoutes = {
  list: "/api/payouts",
  process: "/api/payouts/process",
  vendor: (vendorId: string) => `/api/payouts/vendor/${vendorId}`,
} as const;

export const couponsRoutes = {
  apply: "/api/coupons/apply",
  remove: "/api/coupons/remove",
  eligible: "/api/coupons/eligible",
  eligiblePublic: "/api/coupons/eligible-public",
  list: "/api/coupons",
  create: "/api/coupons",
  detail: (id: string) => `/api/coupons/${id}`,
  status: (id: string) => `/api/coupons/${id}/status`,
  analytics: (id: string) => `/api/coupons/${id}/analytics`,
  bulk: "/api/coupons/bulk",
  batches: "/api/coupons/batches",
  notifyAlerts: "/api/coupons/jobs/notify-alerts",
  vendor: {
    list: "/api/coupons/vendor",
    create: "/api/coupons/vendor",
    absorbedSummary: "/api/coupons/vendor/absorbed-summary",
    detail: (id: string) => `/api/coupons/vendor/${id}`,
    status: (id: string) => `/api/coupons/vendor/${id}/status`,
    analytics: (id: string) => `/api/coupons/vendor/${id}/analytics`,
  },
} as const;
