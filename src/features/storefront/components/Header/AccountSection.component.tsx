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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useIsAuthenticated } from "@/shared/hooks/useRequireAuth.hook";
import { AccountMenu } from "./AccountMenu.component";

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
      <Skeleton
        className={cn(
          "hidden sm:block rounded-full",
          "h-8 w-8",
        )}
        aria-hidden
      />
    );
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <Link
        href={PATHS.login}
        className={cn(
          "hidden sm:inline-flex items-center px-3 py-1.5 text-body-sm font-medium rounded-md transition-colors",
          isTransparent
            ? "text-paper hover:bg-paper/10"
            : "text-ink hover:bg-paper",
        )}
      >
        {LABELS.logIn}
      </Link>
    );
  }

  return (
    <>
      {isCustomerRole(currentUser.role) && showStorefrontChrome ? (
        <div className="hidden xl:flex items-center gap-1">
          <Link
            href={PATHS.orders}
            className={cn(
              "px-3 py-1.5 text-body-sm font-medium rounded-md transition-colors",
              isTransparent ? "text-paper hover:bg-paper/10" : "hover:bg-paper",
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
            "hidden xl:inline-flex items-center px-3 py-1.5 text-body-sm font-medium rounded-md transition-colors",
            isTransparent
              ? "text-paper hover:bg-paper/10"
              : "text-brand hover:bg-brand-subtle",
          )}
        >
          {LABELS.vendorDashboard}
        </Link>
      ) : null}

      {isAdminRole(currentUser.role) ? (
        <Link
          href={PATHS.admin.vendors}
          className={cn(
            "hidden xl:inline-flex items-center px-3 py-1.5 text-body-sm font-medium rounded-md transition-colors",
            isTransparent
              ? "text-paper hover:bg-paper/10"
              : "text-brand hover:bg-brand-subtle",
          )}
        >
          {LABELS.adminPanel}
        </Link>
      ) : null}

      <AccountMenu currentUser={currentUser} isTransparent={isTransparent} />
    </>
  );
}
