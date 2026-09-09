"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import {
  isAdminRole,
  isCustomerRole,
  isVendorRole,
} from "@/shared/utils/roles";
import type { CurrentUser } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useIsAuthenticated } from "@/shared/hooks/useRequireAuth.hook";
import { AccountMenu } from "./AccountMenu.component";
import {
  AccountMenuSkeleton,
  HeaderOrdersLinkSkeleton,
} from "./HeaderActionSkeletons.component";
import { headerStyles as styles } from "./header.styles";

interface AccountSectionProps {
  currentUser: CurrentUser | null;
  isTransparent: boolean;
  showStorefrontChrome: boolean;
}

export function AccountSection({
  currentUser,
  isTransparent,
  showStorefrontChrome,
}: AccountSectionProps) {
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const isAuthenticated = useIsAuthenticated();

  if (!authBootstrapped) {
    return (
      <>
        {showStorefrontChrome ? <HeaderOrdersLinkSkeleton /> : null}
        <AccountMenuSkeleton />
      </>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <Link
        href={PATHS.login}
        className={cn(
          styles.loginLink,
          isTransparent ? styles.loginLinkTransparent : styles.loginLinkSolid,
        )}
      >
        {LABELS.logIn}
      </Link>
    );
  }

  return (
    <>
      {isCustomerRole(currentUser.role) && showStorefrontChrome ? (
        <div className={styles.ordersLinkWrapper}>
          <Link
            href={PATHS.orders}
            className={cn(
              styles.ordersLink,
              isTransparent
                ? styles.ordersLinkTransparent
                : styles.ordersLinkSolid,
            )}
          >
            {LABELS.orders}
          </Link>
        </div>
      ) : null}

      {isVendorRole(currentUser.role) ? (
        <Link
          href={PATHS.vendor.overview}
          className={cn(
            styles.dashboardLink,
            isTransparent
              ? styles.dashboardLinkTransparent
              : styles.dashboardLinkSolid,
          )}
        >
          {LABELS.vendorDashboard}
        </Link>
      ) : null}

      {isAdminRole(currentUser.role) ? (
        <Link
          href={PATHS.admin.vendors}
          className={cn(
            styles.dashboardLink,
            isTransparent
              ? styles.dashboardLinkTransparent
              : styles.dashboardLinkSolid,
          )}
        >
          {LABELS.adminPanel}
        </Link>
      ) : null}

      <AccountMenu currentUser={currentUser} isTransparent={isTransparent} />
    </>
  );
}
