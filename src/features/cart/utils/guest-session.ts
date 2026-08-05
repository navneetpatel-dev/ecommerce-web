const SESSION_COOKIE = 'sessionId'
const SESSION_MAX_AGE_DAYS = 30

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  if (!match) return null
  return decodeURIComponent(match.slice(name.length + 1)) || null
}

/** Ensures a guest cart cookie exists before cart API calls. */
export function ensureGuestSessionId(): string {
  const existing = readCookie(SESSION_COOKIE)
  if (existing) return existing

  const sessionId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`

  const maxAge = SESSION_MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; path=/; max-age=${maxAge}; samesite=lax`
  return sessionId
}
