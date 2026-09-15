import { STORAGE_KEYS } from "@/shared/constants/storage/storage";

/**
 * Platform-agnostic session adapter for the API client (Rule 6/15). The
 * client must not depend on any feature's store; the auth feature registers
 * a store-backed adapter at startup via `registerApiSessionAdapter`. The
 * default adapter reads/writes persisted storage directly so requests made
 * before registration behave identically.
 */
export interface ApiSessionAdapter {
  getAccessToken: () => string | null;
  persistAccessToken: (accessToken: string) => void;
  clearSession: () => void;
  /**
   * Vets a freshly refreshed access token before it's persisted. Return false to reject it —
   * sessionRefresh then treats the refresh as a definitive auth failure (clearing the session)
   * instead of persisting the token and retrying the original request under a possibly different
   * identity. Optional: only an adapter that needs to guard against this (e.g. detecting that an
   * impersonation session silently refreshed back to the acting admin's own identity) implements it.
   */
  acceptRefreshedToken?: (accessToken: string) => boolean;
}

const localStorageAdapter: ApiSessionAdapter = {
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
  persistAccessToken: (accessToken) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  },
  clearSession: () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.SESSION);
  },
};

let adapter: ApiSessionAdapter = localStorageAdapter;

export function registerApiSessionAdapter(next: ApiSessionAdapter): void {
  adapter = next;
}

export function getApiSessionAdapter(): ApiSessionAdapter {
  return adapter;
}

/**
 * Removes persisted credentials straight from storage without going through
 * the registered adapter. Lets store/session owners clear credentials without
 * an adapter→store→adapter recursion (Rule 21: one storage owner per concern).
 */
export function clearPersistedCredentials(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  window.localStorage.removeItem(STORAGE_KEYS.SESSION);
}
