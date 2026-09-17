import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import type { CurrentUser } from "@/shared/api/types";

/**
 * Platform-agnostic session adapter for the API client (Rule 6/15). The
 * client must not depend on any feature's store; the auth feature registers
 * a store-backed adapter at startup via `registerApiSessionAdapter`. The
 * default adapter keeps the access token in memory only so requests made
 * before registration never persist it to readable storage.
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

/** In-memory token used only until `registerApiSessionAdapter` runs. */
let fallbackAccessToken: string | null = null;

const defaultSessionAdapter: ApiSessionAdapter = {
  getAccessToken: () => fallbackAccessToken,
  persistAccessToken: (accessToken) => {
    fallbackAccessToken = accessToken;
  },
  clearSession: () => {
    fallbackAccessToken = null;
    clearPersistedCredentials();
  },
};

let adapter: ApiSessionAdapter = defaultSessionAdapter;

export function registerApiSessionAdapter(next: ApiSessionAdapter): void {
  adapter = next;
}

export function getApiSessionAdapter(): ApiSessionAdapter {
  return adapter;
}

/**
 * Persists the current user snapshot for faster UI hydration after reload.
 * The access token stays in memory only (F-14).
 */
export function persistSessionUser(user: CurrentUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
}

/**
 * Removes persisted credentials straight from storage without going through
 * the registered adapter. Lets store/session owners clear credentials without
 * an adapter→store→adapter recursion (Rule 21: one storage owner per concern).
 * Also drops any leftover pre-F-14 `ACCESS_TOKEN` key.
 */
export function clearPersistedCredentials(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  window.localStorage.removeItem(STORAGE_KEYS.SESSION);
}
