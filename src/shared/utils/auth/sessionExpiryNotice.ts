import { STORAGE_KEYS } from "@/shared/constants/storage/storage";

/**
 * One-shot "your session expired" flag. Set when a terminal 401 forces a
 * sign-out; consumed once by the login form so the forced logout isn't silent.
 * The module cache makes repeated reads safe (React StrictMode double-invokes
 * state initializers/effects in dev).
 */
let cachedNotice: boolean | null = null;

/** Marks that the next login view should explain the forced sign-out. */
export function markForcedSignOut() {
  try {
    window.sessionStorage.setItem(STORAGE_KEYS.SESSION_EXPIRED_NOTICE, "1");
  } catch {
    /* storage unavailable — the notice is best-effort */
  }
}

/** Reads (and clears) the forced sign-out flag; stable across repeated calls. */
export function consumeForcedSignOut(): boolean {
  if (cachedNotice !== null) return cachedNotice;
  try {
    cachedNotice =
      window.sessionStorage.getItem(STORAGE_KEYS.SESSION_EXPIRED_NOTICE) ===
      "1";
    if (cachedNotice) {
      window.sessionStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRED_NOTICE);
    }
  } catch {
    cachedNotice = false;
  }
  return cachedNotice;
}
