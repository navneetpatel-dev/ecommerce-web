import { COOKIES } from '@/shared/constants/storage/storage'

/** Clears any client-visible guest cart cookie leftover from older builds. */
export function clearClientGuestSessionCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIES.SESSION_ID}=; path=/; max-age=0; samesite=lax`
}
