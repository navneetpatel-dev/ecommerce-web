"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { authApi } from "../../api/auth/auth.api";
import { cartKeys } from "@/features/cart";
import {
  persistSessionUser,
  readPersistedSessionUser,
  registerApiSessionAdapter,
} from "@/shared/api/client/sessionAdapter";
import { refreshSessionOrThrow } from "@/shared/api/client/internal/sessionRefresh";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { PATHS } from "@/shared/constants/paths/paths";
import { isDefinitiveAuthFailure } from "@/shared/utils/auth/authSessionError";
import type { CurrentUser } from "@/shared/api/types";
import { decodeJwtPayload } from "../../utils/bootstrap/jwtClaims";

function readStashedImpersonationSession(): {
  accessToken: string;
  user: CurrentUser;
} | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(
    STORAGE_KEYS.IMPERSONATION_ORIGINAL_SESSION,
  );
  if (!raw) return null;
  try {
    const stashed = JSON.parse(raw) as {
      accessToken?: string;
      user?: CurrentUser;
    };
    if (!stashed.accessToken || !stashed.user) return null;
    return { accessToken: stashed.accessToken, user: stashed.user };
  } catch {
    return null;
  }
}

function restoreImpersonationOrigin(): boolean {
  const stashed = readStashedImpersonationSession();
  if (!stashed) return false;
  window.localStorage.removeItem(STORAGE_KEYS.IMPERSONATION_ORIGINAL_SESSION);
  useAuthStore.getState().setSession(stashed.accessToken, stashed.user);
  persistSessionUser(stashed.user);
  window.location.assign(PATHS.admin.root);
  return true;
}

/**
 * Restores the persisted user snapshot and reports whether one existed. That
 * boolean is also the silent-refresh gate in `bootstrap` — reading it once here
 * keeps the two decisions ("who am I showing?" and "is there a session to ask
 * about?") from ever disagreeing.
 */
function hydrateUserFromPersistedSession(): boolean {
  const user = readPersistedSessionUser();
  if (!user) return false;
  useAuthStore.setState({ currentUser: user });
  return true;
}

export const storeSessionAdapter = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  persistAccessToken: (accessToken: string) => {
    useAuthStore.getState().setAccessToken(accessToken);
  },
  clearSession: () => {
    if (restoreImpersonationOrigin()) return;
    useAuthStore.getState().clearSession();
  },
  /**
   * Impersonation tokens are short-lived and deliberately non-renewable (auth.service.ts's
   * `impersonateUser`) — but the acting admin's OWN refresh cookie is still live the whole time,
   * so an ordinary 401 -> refresh cycle after the impersonation token expires silently mints a
   * fresh token for the ADMIN's real identity while the UI still shows "Viewing as X". Reject
   * that token instead of persisting it: sessionRefresh then treats this as a definitive auth
   * failure, and `clearSession` restores the stashed admin session (F-25) instead of a full logout.
   */
  acceptRefreshedToken: (accessToken: string) => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser?.impersonatedBy) return true;
    const decoded = decodeJwtPayload(accessToken);
    return Boolean(decoded?.impersonatedBy) && decoded?.sub === currentUser.id;
  },
};

export function useAuthBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setAuthBootstrapped = useAuthStore((s) => s.setAuthBootstrapped);
  const queryClient = useQueryClient();

  useEffect(() => {
    registerApiSessionAdapter(storeSessionAdapter);
    let cancelled = false;

    async function bootstrap() {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      }
      const hasSessionHint = hydrateUserFromPersistedSession();

      try {
        // No snapshot on disk means this browser has no session to restore, and
        // a refresh attempt is the wrong way to find that out: the cookie is
        // httpOnly, so the only answer the server can give an anonymous visitor
        // is a 401 — which `sessionRefresh` treats as a definitive auth failure
        // and answers with `clearPersistedSession()`. That was the network tab's
        // red `refresh` row on every cold load, in every tab, for a visitor who
        // was never logged in. Skipping it costs nothing: the access token is
        // memory-only (F-14), so a session that exists in this browser always
        // wrote its snapshot here first (login, OTP verify, OAuth callback,
        // vendor registration and impersonation all call `persistSessionUser`),
        // and a stale snapshot — cookie long dead — still enters the branch
        // below and resolves to a guest exactly as before.
        if (!hasSessionHint) return;
        await refreshSessionOrThrow();
        if (cancelled) return;
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
          return;
        }
        const fresh = await authApi.me();
        if (cancelled) return;
        setSession(accessToken, fresh);
        persistSessionUser(fresh);
      } catch (err) {
        if (cancelled) return;
        if (
          isDefinitiveAuthFailure(err) &&
          !useAuthStore.getState().accessToken
        ) {
          clearSession();
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
  }, [setSession, clearSession, setAuthBootstrapped, queryClient]);
}
