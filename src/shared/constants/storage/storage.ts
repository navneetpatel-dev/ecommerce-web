/** Browser storage keys — single source for auth session persistence. */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  SESSION: "session",
  /** The acting admin's own session, stashed while impersonating another user. */
  IMPERSONATION_ORIGINAL_SESSION: "impersonationOriginalSession",
  KYC_NAME_MISMATCH_WARNING: "kycNameMismatchWarning",
  /** Preferred color mode: 'light' | 'dark' (Rule 29 runtime theming). */
  THEME_MODE: "theme",
  /** Selected theme palette preset id (Rule 29 runtime theming). */
  THEME_PALETTE: "themePalette",
  /** Compare tray selection (sessionStorage — survives navigation, not the tab). */
  COMPARE_SELECTION: "compareSelection",
  /**
   * The delivery area the funnel is shopped in (sessionStorage): the pincode a customer
   * checked on a product page has to still be there on the cart and at checkout.
   */
  DELIVERY_LOCATION: "deliveryLocation",
  /**
   * The checkout flow in progress (sessionStorage, B-56): a reload on the payment step
   * resumes it. Cleared when the customer leaves checkout, so a later visit starts fresh.
   */
  CHECKOUT_FLOW: "checkoutFlow",
  /** sessionStorage: the product a guest hearted before signing in, saved after sign-in (C-05). */
  PENDING_WISHLIST: "pendingWishlistProduct",
  /** Last submitted storefront search terms (localStorage — powers the recent list). */
  RECENT_SEARCHES: "recentSearches",
  /** sessionStorage flag: a terminal 401 forced a sign-out (one-shot login notice). */
  SESSION_EXPIRED_NOTICE: "sessionExpiredNotice",
} as const;

/** Cookie names shared with the API (must match backend COOKIES). */
export const COOKIES = {
  SESSION_ID: "sessionId",
} as const;
