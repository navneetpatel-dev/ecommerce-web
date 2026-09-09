"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../auth/auth.api";
import {
  cartApi,
  cartKeys,
  clearClientGuestSessionCookie,
} from "@/features/cart";
import { useAuthStore, postAuthPath } from "@/shared/stores/auth/auth.store";
import { navigateReplace } from "@/shared/utils/navigation/navigate";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import type { RoleName } from "@/shared/api/types";

export function useRequestOtp() {
  return useMutation({
    mutationFn: (email: string) => authApi.requestOtp(email),
  });
}

export function useOtpLogin() {
  const setSession = useAuthStore((state) => state.setSession);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      email,
      code,
    }: {
      email: string;
      code: string;
      redirect?: string | null;
    }) => authApi.verifyOtp(email, code),
    onSuccess: async (data, variables) => {
      setSession(data.accessToken, data.user);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data.user));
      useAuthStore.getState().setAuthBootstrapped(true);
      try {
        const cart = await cartApi.mergeGuest();
        clearClientGuestSessionCookie();
        queryClient.setQueriesData({ queryKey: cartKeys.all }, cart);
      } catch {
        void queryClient.invalidateQueries({ queryKey: cartKeys.all });
      }
      navigateReplace(
        router,
        postAuthPath(data.user.role as RoleName, variables.redirect),
      );
    },
  });
}
