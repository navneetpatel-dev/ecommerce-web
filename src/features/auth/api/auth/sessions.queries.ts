"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { nextPageOf } from "@/shared/api/client/pagination";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { authApi } from "./auth.api";
import { sessionKeys } from "./auth.queries";

/** Signed-in devices, this one first, a page at a time (B-44). */
export function useSessions() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: sessionKeys.all,
    queryFn: ({ pageParam }) => authApi.listSessions(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    enabled: Boolean(accessToken),
  });
}
