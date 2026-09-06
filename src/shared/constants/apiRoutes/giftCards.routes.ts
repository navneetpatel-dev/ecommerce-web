/** Frontend gift card API path builders — must stay aligned with backend mounts under `/api`. */
export const giftCardsRoutes = {
  purchase: "/api/gift-cards/purchase",
  verify: "/api/gift-cards/verify",
  redeem: "/api/gift-cards/redeem",
  byCode: (code: string) => `/api/gift-cards/${encodeURIComponent(code)}`,
} as const;
