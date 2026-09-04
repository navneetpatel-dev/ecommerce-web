/** Frontend order/shipping API path builders — must stay aligned with backend mounts under `/api`. */
export const ordersRoutes = {
  list: (query = "") => `/api/orders${query ? `?${query}` : ""}`,
  detail: (id: string) => `/api/orders/${id}`,
  status: (id: string) => `/api/orders/${id}/status`,
  cancel: (id: string) => `/api/orders/${id}/cancel`,
} as const;

export const subordersRoutes = {
  list: (query = "") => `/api/suborders${query ? `?${query}` : ""}`,
  status: (id: string) => `/api/suborders/${id}/status`,
} as const;

export const returnsRoutes = {
  list: "/api/returns",
  admin: "/api/returns/admin",
  create: "/api/returns",
  transition: (id: string) => `/api/returns/${id}/transition`,
  detail: (id: string) => `/api/returns/${id}`,
  delete: (id: string) => `/api/returns/${id}`,
  creditNote: (id: string) => `/api/returns/${id}/credit-note`,
  debitNote: (id: string) => `/api/returns/${id}/debit-note`,
  retryRefund: (id: string) => `/api/returns/${id}/retry-refund`,
} as const;

export const reviewsRoutes = {
  forProduct: (productId: string) => `/api/reviews/product/${productId}`,
  create: "/api/reviews",
  mine: "/api/reviews/my-reviews",
  vote: (id: string) => `/api/reviews/${id}/vote`,
  approve: (id: string) => `/api/reviews/${id}/approve`,
  reject: (id: string) => `/api/reviews/${id}/reject`,
  moderation: "/api/reviews/moderation",
  respond: (id: string) => `/api/reviews/${id}/respond`,
} as const;

export const shippingRoutes = {
  rates: "/api/shipping/rates",
  zones: "/api/shipping/zones",
  zone: (id: string) => `/api/shipping/zones/${id}`,
  adminRates: "/api/shipping/rates/admin",
  createRate: "/api/shipping/rates",
  tracking: (trackingNumber: string) =>
    `/api/shipping/tracking/${trackingNumber}`,
  reschedule: (trackingNumber: string) =>
    `/api/shipping/tracking/${trackingNumber}/reschedule`,
} as const;

export const taxRoutes = {
  rules: "/api/tax/rules",
  rule: (id: string) => `/api/tax/rules/${id}`,
} as const;
