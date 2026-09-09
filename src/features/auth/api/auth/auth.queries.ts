"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore, postAuthPath } from "@/shared/stores/auth/auth.store";
import { authApi } from "./auth.api";
import {
  cartApi,
  cartKeys,
  clearClientGuestSessionCookie,
} from "@/features/cart";
import { navigate, navigateReplace } from "@/shared/utils/navigation/navigate";
import { PATHS } from "@/shared/constants/paths/paths";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import type { LoginInput, RegisterInput } from "../../schemas/auth/auth.schema";
import type { CurrentUser, RoleName } from "@/shared/api/types";
import { removeCurrentPushSubscription } from "@/shared/hooks/usePushSubscription.hook";

function persistSession(accessToken: string, user: CurrentUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
}

function clearPersistedSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

async function absorbGuestCartAfterAuth(accessToken: string) {
  // Token must be in the store before the merge request is authorized.
  useAuthStore.getState().setAccessToken(accessToken);
  useAuthStore.getState().setAuthBootstrapped(true);
  try {
    const cart = await cartApi.mergeGuest();
    clearClientGuestSessionCookie();
    return cart;
  } catch {
    // Non-fatal: next authenticated cart GET still absorbs any leftover guest cart.
    return null;
  }
}

export const sessionKeys = {
  all: ["auth", "sessions"] as const,
};

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      redirect: _redirect,
      ...input
    }: LoginInput & { redirect?: string | null }) => authApi.login(input),
    onSuccess: async (data, variables) => {
      setSession(data.accessToken, data.user);
      persistSession(data.accessToken, data.user);
      const cart = await absorbGuestCartAfterAuth(data.accessToken);
      if (cart) {
        queryClient.setQueriesData({ queryKey: cartKeys.all }, cart);
      } else {
        void queryClient.invalidateQueries({ queryKey: cartKeys.all });
      }
      navigateReplace(
        router,
        postAuthPath(data.user.role as RoleName, variables.redirect),
      );
    },
  });
}

/**
 * Registration no longer grants a session — the account can't log in until
 * the email link is clicked, so there's nothing to persist or navigate to
 * here. The card shows a "check your email" confirmation off `data` instead.
 */
export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Logout must still complete when browser push cleanup is unavailable.
      await removeCurrentPushSubscription().catch(() => undefined);
      return authApi.logout();
    },
    onSuccess: () => {
      clearSession();
      clearPersistedSession();
      clearClientGuestSessionCookie();
      queryClient.clear();
      navigateReplace(router, PATHS.login);
    },
    onError: () => {
      clearSession();
      clearPersistedSession();
      clearClientGuestSessionCookie();
      queryClient.clear();
      navigateReplace(router, PATHS.login);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: (input: { token: string; newPassword: string }) =>
      authApi.resetPassword(input.token, input.newPassword),
    onSuccess: () => navigate(router, PATHS.login),
  });
}

/**
 * Click-only verification (see the auth service) — the person verifying is
 * essentially never logged in in this browser (registration no longer
 * grants a session), so there's no local session state to refresh here.
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: () => authApi.resendVerification(),
  });
}

/** Unauthenticated counterpart — for someone blocked at login by an unverified email. */
export function useResendVerificationByEmail() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerificationByEmail(email),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(input),
  });
}

export function useSessions() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: () => authApi.listSessions(),
    enabled: Boolean(accessToken),
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (family: string) => authApi.revokeSession(family),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.revokeOtherSessions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
