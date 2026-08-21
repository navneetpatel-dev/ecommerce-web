import { STORAGE_KEYS } from "@/shared/constants/storage";

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
