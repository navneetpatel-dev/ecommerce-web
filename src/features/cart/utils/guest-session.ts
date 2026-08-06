const SESSION_COOKIE = 'sessionId'

/** Clears any client-visible guest cart cookie leftover from older builds. */
export function clearClientGuestSessionCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`
}
