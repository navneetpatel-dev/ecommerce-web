"use client";

import { useAuthStore } from "@/shared/stores/auth/auth.store";
import {
  useAuthPromptStore,
  type AuthPromptOptions,
} from "@/shared/stores/auth/authPrompt.store";

export function useIsAuthenticated() {
  return useAuthStore((s) => Boolean(s.accessToken || s.currentUser));
}

/**
 * Returns true when the user is signed in.
 * When not, opens the login prompt and returns false — call before gated actions.
 */
export function useRequireAuth() {
  const isAuthenticated = useIsAuthenticated();
  const openPrompt = useAuthPromptStore((s) => s.openPrompt);

  const requireAuth = (options: AuthPromptOptions | string): boolean => {
    if (isAuthenticated) return true;
    if (typeof options === "string") {
      openPrompt({ message: options });
    } else {
      openPrompt(options);
    }
    return false;
  };

  return { isAuthenticated, requireAuth };
}
