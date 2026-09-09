"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useAuthPromptStore } from "@/shared/stores/auth/authPrompt.store";
import { PATHS } from "@/shared/constants/paths/paths";

interface AuthGateProps {
  children: React.ReactNode;
  promptTitle?: string;
  promptMessage?: string;
}

export function AuthGate({
  children,
  promptTitle = "Sign in to continue",
  promptMessage = "Please log in to access this page.",
}: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const accessToken = useAuthStore((s) => s.accessToken);
  const openPrompt = useAuthPromptStore((s) => s.openPrompt);

  const isAuthenticated = Boolean(accessToken);

  useEffect(() => {
    if (!authBootstrapped) return;
    if (!isAuthenticated) {
      openPrompt({
        title: promptTitle,
        message: promptMessage,
        redirectTo: pathname,
      });
      router.replace(PATHS.loginWithRedirect(pathname));
    }
  }, [
    authBootstrapped,
    isAuthenticated,
    openPrompt,
    pathname,
    promptMessage,
    promptTitle,
    router,
  ]);

  if (!authBootstrapped || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
