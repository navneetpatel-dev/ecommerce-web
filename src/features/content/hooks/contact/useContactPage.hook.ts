"use client";

import { usePublicSettings } from "@/shared/hooks/usePublicSettings.hook";

export function useContactPage() {
  const { data: settings, isLoading } = usePublicSettings();
  return {
    supportEmail: settings?.supportEmail ?? null,
    supportHours: settings?.supportHours ?? null,
    isLoading,
  };
}
