/** Browser storage keys — single source for auth session persistence. */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  SESSION: 'session',
} as const

/** Cookie names shared with the API (must match backend COOKIES). */
export const COOKIES = {
  SESSION_ID: 'sessionId',
} as const
