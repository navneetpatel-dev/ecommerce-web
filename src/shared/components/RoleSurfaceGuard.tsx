"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth.store";
import {
  deniedAccessRedirect,
  isPathAllowedForRole,
  surfaceForPath,
} from "@/shared/utils/roleSurface";

/**
 * Enforces role surfaces for every route:
 * - Admin → /admin/* only (not storefront / vendor)
 * - Vendor → /vendor/* dashboard only (not storefront / admin)
 * - Customer → storefront only (not /admin /vendor)
 * - Guests → storefront + auth; /admin|/vendor → login
 *
 * Covers typed URLs, bookmarks, and in-app links.
 */
export function RoleSurfaceGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const accessToken = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.currentUser?.role);
  const [pass, setPass] = useState(false);

  const authenticated = Boolean(accessToken && role);
  const surface = useMemo(() => surfaceForPath(pathname), [pathname]);
  const allowed = useMemo(
    () => isPathAllowedForRole(pathname, role, authenticated),
    [authenticated, pathname, role],
  );

  useEffect(() => {
    if (!authBootstrapped) {
      setPass(false);
      return;
    }

    if (allowed) {
      setPass(true);
      return;
    }

    setPass(false);
    router.replace(deniedAccessRedirect(pathname, role, authenticated));
  }, [allowed, authBootstrapped, authenticated, pathname, role, router]);

  // Avoid flashing the wrong role's UI while deciding / redirecting.
  if (!authBootstrapped) {
    if (surface === "admin" || surface === "vendor") return null;
    return <>{children}</>;
  }

  if (!allowed && surface !== "auth") {
    return null;
  }

  if (!pass && surface !== "auth") {
    return null;
  }

  return <>{children}</>;
}
