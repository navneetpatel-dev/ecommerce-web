"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { PATHS } from "@/shared/constants/paths/paths";
import { currentReturnPath } from "@/shared/utils/auth/authReturn";

interface AuthGateProps {
  children: React.ReactNode;
}

/**
 * Page-level sign-in gate. A signed-out visitor is sent straight to the login
 * page (which explains why), carrying the full path + query to come back to.
 * It deliberately does not also open the sign-in prompt: that stacked a modal
 * on top of the login form it was asking them to open.
 */
export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const accessToken = useAuthStore((s) => s.accessToken);

  const isAuthenticated = Boolean(accessToken);

  useEffect(() => {
    if (!authBootstrapped || isAuthenticated) return;
    router.replace(PATHS.loginWithRedirect(currentReturnPath()));
  }, [authBootstrapped, isAuthenticated, router]);

  if (!authBootstrapped || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
