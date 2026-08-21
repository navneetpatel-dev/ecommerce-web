/** Frontend finance API path builders — must stay aligned with backend mounts under `/api`. */
export const walletRoutes = {
  balance: "/api/wallet/balance",
  transactions: "/api/wallet/transactions",
} as const;

export const commissionsRoutes = {
  list: "/api/commissions",
  vendor: (vendorId: string) => `/api/commissions/vendor/${vendorId}`,
} as const;

export const payoutsRoutes = {
  list: "/api/payouts",
  process: "/api/payouts/process",
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
  vendor: {
    list: "/api/coupons/vendor",
    create: "/api/coupons/vendor",
    absorbedSummary: "/api/coupons/vendor/absorbed-summary",
    detail: (id: string) => `/api/coupons/vendor/${id}`,
    status: (id: string) => `/api/coupons/vendor/${id}/status`,
    analytics: (id: string) => `/api/coupons/vendor/${id}/analytics`,
  },
} as const;
