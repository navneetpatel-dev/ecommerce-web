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
} as const;

/** Cookie names shared with the API (must match backend COOKIES). */
export const COOKIES = {
  SESSION_ID: "sessionId",
} as const;
