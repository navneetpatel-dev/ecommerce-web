"use client";

import { usePathname } from "next/navigation";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import type { PermissionKey } from "@/shared/constants/permissions/permissions";

export function RequirePermission({
  permission,
  children,
}: {
  permission: PermissionKey | PermissionKey[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { hasAnyPermission } = usePermissions();
  const allowed = hasAnyPermission(
    ...(Array.isArray(permission) ? permission : [permission]),
  );
  if (!allowed) {
    const isVendorRoute = pathname?.startsWith("/vendor");
    return (
      <EmptyState
        heading={LABELS.accessDeniedHeading}
        message={LABELS.accessDeniedMessage}
        actionLabel={
          isVendorRoute ? "Go to vendor overview" : LABELS.goToAdminDashboard
        }
        actionTo={isVendorRoute ? PATHS.vendor.overview : PATHS.admin.root}
      />
    );
  }
  return <>{children}</>;
}
