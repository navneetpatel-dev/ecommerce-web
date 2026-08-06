/** Machine-readable API error codes — keep in sync with backend ERROR_CODES. */
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  RATE_LIMITED: 'RATE_LIMITED',
  EMPTY_RESPONSE: 'EMPTY_RESPONSE',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  REQUEST_FAILED: 'REQUEST_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  ITEMS_UNAVAILABLE: 'ITEMS_UNAVAILABLE',
  VENDOR_UNAVAILABLE: 'VENDOR_UNAVAILABLE',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

/** Repeated client-facing API messages. */
export const ERROR_MESSAGES = {
  SESSION_EXPIRED: 'Session expired. Please log in again.',
  RATE_LIMITED: 'Too many requests. Please wait and try again.',
} as const
