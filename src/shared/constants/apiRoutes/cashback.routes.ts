/** Cashback offers and the customer's cashback history — aligned with backend mounts under `/api`. */
export const cashbackRoutes = {
  liveOffers: "/api/cashback-offers/live",
  history: "/api/wallet/cashback",
  adminOffers: "/api/cashback-offers",
  adminOffer: (id: string) => `/api/cashback-offers/${id}`,
} as const;
