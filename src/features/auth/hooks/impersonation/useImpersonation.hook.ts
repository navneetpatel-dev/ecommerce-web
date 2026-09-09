"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { authApi } from "../../api/auth/auth.api";
import type { CurrentUser } from "@/shared/api/types";

function persistSession(accessToken: string, user: CurrentUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  window.localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
}

/** Support "log in as user": swaps the session to a short-lived impersonation
 * token, stashing the acting admin's own session so it can be restored later. */
export function useImpersonation() {
  const setSession = useAuthStore((s) => s.setSession);
  const currentUser = useAuthStore((s) => s.currentUser);
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isImpersonating = Boolean(currentUser?.impersonatedBy);

  const startImpersonation = async (userId: string) => {
    setStarting(true);
    setError(null);
    try {
      const { accessToken: adminToken, currentUser: adminUser } =
        useAuthStore.getState();
      const result = await authApi.impersonate(userId);

      if (typeof window !== "undefined" && adminToken && adminUser) {
        window.localStorage.setItem(
          STORAGE_KEYS.IMPERSONATION_ORIGINAL_SESSION,
          JSON.stringify({ accessToken: adminToken, user: adminUser }),
        );
      }

      setSession(result.accessToken, result.user);
      persistSession(result.accessToken, result.user);
      router.push(PATHS.home);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.impersonationStartFailed));
    } finally {
      setStarting(false);
    }
  };

  const exitImpersonation = () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(
      STORAGE_KEYS.IMPERSONATION_ORIGINAL_SESSION,
    );
    window.localStorage.removeItem(STORAGE_KEYS.IMPERSONATION_ORIGINAL_SESSION);

    if (!raw) {
      useAuthStore.getState().clearSession();
      router.push(PATHS.login);
      return;
    }

    const stashed = JSON.parse(raw) as {
      accessToken: string;
      user: CurrentUser;
    };
    setSession(stashed.accessToken, stashed.user);
    persistSession(stashed.accessToken, stashed.user);
    router.push(PATHS.admin.root);
  };

  return {
    isImpersonating,
    startImpersonation,
    exitImpersonation,
    starting,
    error,
  };
}
