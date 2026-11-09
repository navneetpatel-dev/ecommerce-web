/** Frontend gift card API path builders — must stay aligned with backend mounts under `/api`. */
export const giftCardsRoutes = {
  purchase: "/api/gift-cards/purchase",
  verify: "/api/gift-cards/verify",
  redeem: "/api/gift-cards/redeem",
  byCode: (code: string) => `/api/gift-cards/${encodeURIComponent(code)}`,
  mine: "/api/gift-cards/mine",
  resend: (id: string) => `/api/gift-cards/${id}/resend`,
  adminList: "/api/gift-cards/admin",
  adminLiability: "/api/gift-cards/admin/liability",
  adminCancel: (id: string) => `/api/gift-cards/admin/${id}/cancel`,
} as const;
