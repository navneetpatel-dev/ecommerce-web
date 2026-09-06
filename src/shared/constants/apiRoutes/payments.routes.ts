/** Frontend saved-payment-method API path builders — must stay aligned with backend mounts under `/api`. */
export const paymentsRoutes = {
  savedMethods: "/api/payments/saved-methods",
  savedMethod: (id: string) => `/api/payments/saved-methods/${id}`,
} as const;
