import { PATHS } from "@/shared/constants/paths/paths";
import {
  ADMIN_ROLES,
  VENDOR_ROLES,
  type RoleName,
} from "@/shared/constants/labels";
import {
  isAdminRole,
  isCustomerRole,
  isVendorRole,
  isWorkspaceRole,
} from "@/shared/utils/roles/roles";

export type AppSurface = "admin" | "vendor" | "storefront" | "auth";

/**
 * Vendor dashboard surface (`/vendor`, `/vendor/dashboard/...`).
 * Must not match public storefront shops under `/vendors/...`.
 */
export function isVendorWorkspacePath(pathname: string): boolean {
  return (
    pathname === PATHS.vendor.root ||
    pathname.startsWith(`${PATHS.vendor.root}/`)
  );
}

/** Default landing path for a signed-in role. */
export function defaultRouteForRole(role: RoleName): string {
  if ((ADMIN_ROLES as readonly string[]).includes(role))
    return PATHS.admin.root;
  if ((VENDOR_ROLES as readonly string[]).includes(role))
    return PATHS.vendor.overview;
  return PATHS.home;
}

/** Classify a URL into an app surface. */
export function surfaceForPath(pathname: string): AppSurface {
  if (
    pathname.startsWith(PATHS.login) ||
    pathname.startsWith(PATHS.otp) ||
    pathname.startsWith(PATHS.register) ||
    pathname.startsWith(PATHS.forgotPassword) ||
    pathname.startsWith(PATHS.resetPassword) ||
    pathname.startsWith(PATHS.vendor.register)
  ) {
    return "auth";
  }
  if (pathname.startsWith(PATHS.admin.root)) return "admin";
  if (isVendorWorkspacePath(pathname)) return "vendor";
  return "storefront";
}

export function isWorkspacePath(pathname: string): boolean {
  const surface = surfaceForPath(pathname);
  return surface === "admin" || surface === "vendor";
}

/** Public catalog routes that any role (or guest) can view. */
export function isPublicCatalogPath(pathname: string): boolean {
  return (
    pathname === PATHS.home ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/vendors") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/brands")
  );
}

/** Whether this role may remain on the given path (hardcoded URL safe). */
export function isPathAllowedForRole(
  pathname: string,
  role: RoleName | null | undefined,
  authenticated: boolean,
  isImpersonating = false,
): boolean {
  if (isImpersonating) return true;
  const surface = surfaceForPath(pathname);

  if (surface === "auth") return true;

  if (surface === "admin") {
    return authenticated && isAdminRole(role);
  }

  if (surface === "vendor") {
    return authenticated && isVendorRole(role);
  }

  // Public catalog storefront pages are viewable by any role
  if (isPublicCatalogPath(pathname)) return true;

  // Personal shopper routes (cart, checkout, orders, account):
  if (!authenticated) return true;
  return isCustomerRole(role) || isVendorRole(role);
}

/** Where to send a user that opened a path outside their role surface. */
export function deniedAccessRedirect(
  pathname: string,
  role: RoleName | null | undefined,
  authenticated: boolean,
): string {
  const surface = surfaceForPath(pathname);

  if ((surface === "admin" || surface === "vendor") && !authenticated) {
    return PATHS.loginWithRedirect(pathname);
  }

  if (role) return defaultRouteForRole(role);
  return PATHS.home;
}

/** Honor ?redirect= only when it stays inside that role's allowed surface. */
export function postAuthPath(role: RoleName, redirect?: string | null): string {
  const fallback = defaultRouteForRole(role);
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return fallback;
  }
  if (isPathAllowedForRole(redirect, role, true)) return redirect;
  return fallback;
}

/** Brand / home link — never leaves the current role surface. */
export function homePathForContext(
  role: RoleName | null | undefined,
  pathname: string,
): string {
  const surface = surfaceForPath(pathname);
  if (surface === "admin") return PATHS.admin.root;
  if (surface === "vendor") return PATHS.vendor.overview;
  if (role && isWorkspaceRole(role)) return defaultRouteForRole(role);
  return PATHS.home;
}
