"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { authApi } from "../../api/auth/auth.api";
import { cartKeys } from "@/features/cart";
import { registerApiSessionAdapter } from "@/shared/api/client/sessionAdapter";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { isDefinitiveAuthFailure } from "@/shared/utils/auth/authSessionError";

/**
 * Decodes a JWT's payload without verifying its signature — verification already happened
 * server-side; this only reads claims already trusted enough to have been handed back to us.
 */
function decodeJwtPayload(
  token: string,
): { sub?: string; impersonatedBy?: string } | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(json) as { sub?: string; impersonatedBy?: string };
  } catch {
    return null;
  }
}

const storeSessionAdapter = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  persistAccessToken: (accessToken: string) => {
    useAuthStore.getState().setAccessToken(accessToken);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  },
  clearSession: () => {
    useAuthStore.getState().clearSession();
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.IMPERSONATION_ORIGINAL_SESSION);
  },
  /**
   * Impersonation tokens are short-lived and deliberately non-renewable (auth.service.ts's
   * `impersonateUser`) — but the acting admin's OWN refresh cookie is still live the whole time,
   * so an ordinary 401 -> refresh cycle after the impersonation token expires silently mints a
   * fresh token for the ADMIN's real identity while the UI still shows "Viewing as X". Reject
   * that token instead of persisting it: sessionRefresh then treats this as a definitive auth
   * failure, clearing the (impersonated) session exactly like any other expired session, so the
   * admin gets a clean re-login/re-impersonate prompt rather than silently acting as themselves
   * under a stale "impersonating" banner and stale permission set.
   */
  acceptRefreshedToken: (accessToken: string) => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser?.impersonatedBy) return true;
    const decoded = decodeJwtPayload(accessToken);
    return Boolean(decoded?.impersonatedBy) && decoded?.sub === currentUser.id;
  },
};

export function useAuthBootstrap() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setAuthBootstrapped = useAuthStore((s) => s.setAuthBootstrapped);
  const queryClient = useQueryClient();

  useEffect(() => {
    registerApiSessionAdapter(storeSessionAdapter);
    let cancelled = false;

    async function bootstrap() {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION);

      // Guests: cart can load immediately with the session cookie.
      if (!token) {
        if (!cancelled) setAuthBootstrapped(true);
        return;
      }

      if (sessionStr) {
        try {
          setSession(token, JSON.parse(sessionStr));
        } catch {
          setAccessToken(token);
        }
      } else {
        setAccessToken(token);
      }

      // Wait for me() (and any 401 → refresh → retry) before enabling cart.
      // Otherwise optional cart routes used to succeed as guest with an expired Bearer.
      try {
        const fresh = await authApi.me();
        if (cancelled) return;
        const accessToken = useAuthStore.getState().accessToken ?? token;
        setSession(accessToken, fresh);
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(fresh));
      } catch (err) {
        if (cancelled) return;
        if (isDefinitiveAuthFailure(err)) {
          clearSession();
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        }
      } finally {
        if (!cancelled) {
          setAuthBootstrapped(true);
          void queryClient.invalidateQueries({ queryKey: cartKeys.all });
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [
    setAccessToken,
    setSession,
    clearSession,
    setAuthBootstrapped,
    queryClient,
  ]);
}
