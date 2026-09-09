import { useCallback } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { useImpersonation } from "@/features/auth";

export function useImpersonateUserButton(userId: string) {
  const { hasAnyPermission } = usePermissions();
  const { startImpersonation, starting, error } = useImpersonation();

  const isAllowed = hasAnyPermission(PERMISSIONS.USER_IMPERSONATE);

  const handleStartImpersonation = useCallback(() => {
    void startImpersonation(userId);
  }, [startImpersonation, userId]);

  return {
    isAllowed,
    starting,
    error,
    handleStartImpersonation,
  };
}
