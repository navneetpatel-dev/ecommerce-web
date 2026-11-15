"use client";

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
  const { hasAnyPermission } = usePermissions();
  const allowed = hasAnyPermission(
    ...(Array.isArray(permission) ? permission : [permission]),
  );
  if (!allowed) {
    return (
      <EmptyState
        heading={LABELS.accessDeniedHeading}
        message={LABELS.accessDeniedMessage}
        actionLabel={LABELS.goToAdminDashboard}
        actionTo={PATHS.admin.root}
      />
    );
  }
  return <>{children}</>;
}
