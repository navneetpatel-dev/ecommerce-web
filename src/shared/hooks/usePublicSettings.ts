"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/features/admin-dashboard/api/settings.api";

export const settingsKeys = {
  public: ["settings", "public"] as const,
};

export function usePublicSettings() {
  return useQuery({
    queryKey: settingsKeys.public,
    queryFn: () => settingsApi.getPublic(),
    staleTime: 1000 * 60 * 5,
  });
}
