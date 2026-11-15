"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminLayout } from "@/shared/hooks/navigation/useAdminLayout.hook";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { PATHS } from "@/shared/constants/paths/paths";

export function useAdminHomeRedirect() {
  const router = useRouter();
  const { navItems } = useAdminLayout();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (hasPermission(PERMISSIONS.ANALYTICS_VIEW)) {
      router.replace(PATHS.admin.analytics);
      return;
    }
    router.replace(navItems[0]?.href ?? PATHS.admin.analytics);
  }, [hasPermission, navItems, router]);
}
