"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../api/auth/auth.api";
import { cartApi, cartKeys } from "@/features/cart";
import { clearClientGuestSessionCookie } from "@/features/cart";
import {
  useAuthStore,
  postAuthPath,
  defaultRouteForRole,
} from "@/shared/stores/auth/auth.store";
import { navigateReplace } from "@/shared/utils/navigation/navigate";
import { PATHS } from "@/shared/constants/paths/paths";
import { persistSessionUser } from "@/shared/api/client/sessionAdapter";
import { LABELS } from "@/shared/constants/labels";
import { sanitizeUserFacingMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { CurrentUser, RoleName } from "@/shared/api/types";

function persistSession(_accessToken: string, user: CurrentUser) {
  persistSessionUser(user);
}

export function useOAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  const started = useRef(false);
  const [message, setMessage] = useState<string>(LABELS.oauthCompletingSignIn);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const accessToken = searchParams.get("accessToken");
    const errorCode = searchParams.get("error");
    const errorMessage = searchParams.get("message");
    const redirect = searchParams.get("redirect");

    if (errorCode || !accessToken) {
      const fallback =
        errorCode === "OAUTH_NOT_CONFIGURED"
          ? LABELS.oauthNotConfigured
          : LABELS.oauthSignInFailed;
      const loginError = sanitizeUserFacingMessage(errorMessage, fallback);
      navigateReplace(
        router,
        `${PATHS.login}?oauthError=${encodeURIComponent(loginError)}`,
      );
      return;
    }

    void (async () => {
      try {
        useAuthStore.getState().setAccessToken(accessToken);
        useAuthStore.getState().setAuthBootstrapped(true);

        const user = await authApi.me();
        setSession(accessToken, user);
        persistSession(accessToken, user);

        try {
          const cart = await cartApi.mergeGuest();
          clearClientGuestSessionCookie();
          if (cart) {
            queryClient.setQueriesData({ queryKey: cartKeys.all }, cart);
          } else {
            void queryClient.invalidateQueries({ queryKey: cartKeys.all });
          }
        } catch {
          void queryClient.invalidateQueries({ queryKey: cartKeys.all });
        }

        const destination =
          redirect && redirect.startsWith("/")
            ? redirect
            : postAuthPath(user.role as RoleName, null) ||
              defaultRouteForRole(user.role as RoleName);

        navigateReplace(router, destination);
      } catch {
        setMessage(LABELS.oauthSignInFailed);
        navigateReplace(
          router,
          `${PATHS.login}?oauthError=${encodeURIComponent(LABELS.oauthSignInFailed)}`,
        );
      }
    })();
  }, [queryClient, router, searchParams, setSession]);

  return { message };
}
