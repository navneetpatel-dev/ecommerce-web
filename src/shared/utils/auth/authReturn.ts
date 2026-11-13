import { STORAGE_KEYS } from "@/shared/constants/storage/storage";

/** A remembered scroll position is only worth restoring for this long. */
const MAX_AGE_MS = 30 * 60 * 1000;

interface SavedScroll {
  path: string;
  y: number;
  at: number;
}

/**
 * Accepts only same-origin, app-relative return paths ("/wallet?tab=1"),
 * never protocol-relative ("//evil.com") or absolute URLs.
 */
export function safeReturnPath(raw: string | null | undefined): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

/** The current location as a return path (path + query). */
export function currentReturnPath(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}

/** Canonical "path?query" so `location.search` and `URLSearchParams` agree. */
function normalisePath(path: string): string {
  try {
    const url = new URL(path, "http://local");
    const query = url.searchParams.toString();
    return query ? `${url.pathname}?${query}` : url.pathname;
  } catch {
    return path;
  }
}

/**
 * Remembers where on `path` the visitor was when sign-in interrupted them, so
 * the page can scroll back there after login. Best-effort: storage may be off.
 */
export function rememberAuthReturnScroll(path: string): void {
  try {
    const saved: SavedScroll = {
      path: normalisePath(path),
      y: window.scrollY,
      at: Date.now(),
    };
    window.sessionStorage.setItem(
      STORAGE_KEYS.AUTH_RETURN_SCROLL,
      JSON.stringify(saved),
    );
  } catch {
    /* storage unavailable — return position is best-effort */
  }
}

/**
 * The remembered offset for `path`, or null. Non-destructive so StrictMode's
 * double effect run still restores; call `clearAuthReturnScroll` once applied.
 */
export function peekAuthReturnScroll(path: string): number | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.AUTH_RETURN_SCROLL);
    if (!raw) return null;
    const saved = JSON.parse(raw) as SavedScroll;
    if (saved.path !== normalisePath(path)) return null;
    if (Date.now() - saved.at > MAX_AGE_MS || saved.y <= 0) {
      clearAuthReturnScroll();
      return null;
    }
    return saved.y;
  } catch {
    return null;
  }
}

export function clearAuthReturnScroll(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEYS.AUTH_RETURN_SCROLL);
  } catch {
    /* storage unavailable */
  }
}
