import { create } from "zustand";
import type { RoleName } from "@/shared/constants/labels";
import type { CurrentUser } from "@/shared/api/types";
import { clearPersistedCredentials } from "@/shared/api/sessionAdapter";
import {
  defaultRouteForRole as defaultRouteForRoleFromSurface,
  postAuthPath as postAuthPathFromSurface,
} from "@/shared/utils/roleSurface";

interface AuthState {
  accessToken: string | null;
  currentUser: CurrentUser | null;
  /** False until localStorage session is restored (or confirmed absent). Prevents cart race on refresh. */
  authBootstrapped: boolean;
  setSession: (token: string, user: CurrentUser) => void;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
  setAuthBootstrapped: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  currentUser: null,
  authBootstrapped: false,
  setSession: (accessToken, currentUser) => set({ accessToken, currentUser }),
  setAccessToken: (accessToken) => set({ accessToken }),
  /**
   * Clears the in-memory session AND the persisted credentials (Rule 21:
   * single storage owner — components never touch storage directly).
   */
  clearSession: () => {
    clearPersistedCredentials();
    set({ accessToken: null, currentUser: null });
  },
  setAuthBootstrapped: (authBootstrapped) => set({ authBootstrapped }),
}));

export function defaultRouteForRole(role: RoleName): string {
  return defaultRouteForRoleFromSurface(role);
}

export function postAuthPath(role: RoleName, redirect?: string | null): string {
  return postAuthPathFromSurface(role, redirect);
}
