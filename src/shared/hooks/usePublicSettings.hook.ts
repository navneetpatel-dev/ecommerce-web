"use client";

import { useQuery } from "@tanstack/react-query";
import { publicSettingsApi } from "@/shared/api/publicSettings.api";

export const settingsKeys = {
  public: ["settings", "public"] as const,
};

export function usePublicSettings() {
  return useQuery({
    queryKey: settingsKeys.public,
    queryFn: () => publicSettingsApi.getPublic(),
    staleTime: 1000 * 60 * 5,
  });
}
