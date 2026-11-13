"use client";

import { useSearchParams } from "next/navigation";
import { PATHS } from "@/shared/constants/paths/paths";
import { safeReturnPath } from "@/shared/utils/auth/authReturn";

/**
 * The page an auth screen should send the visitor back to (`?redirect=`), plus
 * login/register links that keep carrying it, so hopping between auth screens
 * never drops the way back.
 */
export function useAuthReturnPath() {
  const searchParams = useSearchParams();
  const returnPath = safeReturnPath(searchParams.get("redirect"));

  return {
    returnPath,
    loginHref: returnPath ? PATHS.loginWithRedirect(returnPath) : PATHS.login,
    registerHref: returnPath
      ? PATHS.registerWithRedirect(returnPath)
      : PATHS.register,
  };
}
