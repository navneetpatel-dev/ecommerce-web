"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/dom/cn";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import {
  isAdminRole,
  isCustomerRole,
  isVendorRole,
} from "@/shared/utils/roles/roles";
import type { CurrentUser } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useIsAuthenticated } from "@/shared/hooks/auth/useRequireAuth.hook";
import { AccountMenu } from "./AccountMenu.component";
import {
  AccountMenuSkeleton,
  HeaderOrdersLinkSkeleton,
} from "./HeaderActionSkeletons.component";
import { headerStyles as styles } from "../../styles/header/header.styles";

interface AccountSectionProps {
  currentUser: CurrentUser | null;
  showStorefrontChrome: boolean;
}

export function AccountSection({
  currentUser,
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
        className={cn(styles.loginLink, styles.loginLinkSolid)}
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
            className={cn(styles.ordersLink, styles.ordersLinkSolid)}
          >
            {LABELS.orders}
          </Link>
        </div>
      ) : null}

      {isVendorRole(currentUser.role) ? (
        <Link
          href={PATHS.vendor.overview}
          className={cn(styles.dashboardLink, styles.dashboardLinkSolid)}
        >
          {LABELS.vendorDashboard}
        </Link>
      ) : null}

      {isAdminRole(currentUser.role) ? (
        <Link
          href={PATHS.admin.vendors}
          className={cn(styles.dashboardLink, styles.dashboardLinkSolid)}
        >
          {LABELS.adminPanel}
        </Link>
      ) : null}

      <AccountMenu currentUser={currentUser} />
    </>
  );
}
