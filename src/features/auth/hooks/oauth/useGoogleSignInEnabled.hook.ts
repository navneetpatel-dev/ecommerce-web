"use client";

import { usePublicSettings } from "@/shared/hooks/usePublicSettings.hook";

/**
 * True only once the server says Google sign-in is configured (C-03), so the
 * button never leads to the "not set up" error page.
 */
export function useGoogleSignInEnabled(): boolean {
  const { data } = usePublicSettings();
  return data?.googleSignInEnabled === true;
}
