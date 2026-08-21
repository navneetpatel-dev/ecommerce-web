/** Frontend cart / checkout / wishlist API path builders — must stay aligned with backend mounts under `/api`. */
export const cartRoutes = {
  root: "/api/cart",
  items: "/api/cart/items",
  item: (id: string) => `/api/cart/items/${id}`,
  merge: "/api/cart/merge",
  clear: "/api/cart/clear",
} as const;

export const checkoutRoutes = {
  quote: "/api/checkout/quote",
  create: "/api/checkout",
  cancel: "/api/checkout/cancel",
  verify: "/api/checkout/verify",
} as const;

export const wishlistRoutes = {
  root: "/api/wishlist",
  items: "/api/wishlist/items",
  item: (productId: string) => `/api/wishlist/items/${productId}`,
  moveToCart: (productId: string) =>
    `/api/wishlist/items/${productId}/move-to-cart`,
} as const;
