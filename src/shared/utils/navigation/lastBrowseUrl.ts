/**
 * Tracks the last non-support page the user browsed, so bug report / support ticket forms can
 * capture a more useful "page URL" than `document.referrer` (which is empty for direct navigation
 * within a SPA) or the current `/new` form URL itself.
 */

const STORAGE_KEY = 'ecommerce:lastBrowseUrl'

/** Paths that should not overwrite the last browsed URL (the report/ticket forms themselves). */
const EXCLUDED_PATH_PREFIXES = [
  '/support/tickets/new',
  '/support/bug-reports/new',
  '/vendor/dashboard/bug-reports/new',
]

function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

/** Records the current page URL for later use, skipping the bug/ticket "new" form routes. */
export function captureBrowseUrl(pathname: string): void {
  if (typeof window === 'undefined') return
  if (isExcludedPath(pathname)) return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, window.location.href)
  } catch {
    // sessionStorage may be unavailable (e.g. private browsing) — safe to ignore.
  }
}

/** Best-effort page URL for bug reports: last browsed page, then referrer, then current URL. */
export function readLastBrowseUrl(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    if (stored) return stored
  } catch {
    // ignore storage errors and fall through to referrer/current URL
  }
  return document.referrer || window.location.href || null
}
