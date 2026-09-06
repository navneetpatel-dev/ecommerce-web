"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { usePermissions } from "@/shared/hooks/usePermissions.hook";
import { useImpersonation } from "@/features/auth";

interface ImpersonateUserButtonProps {
  userId: string;
}

/** Support "log in as user" trigger — only rendered for callers with USER_IMPERSONATE. */
export function ImpersonateUserButton({ userId }: ImpersonateUserButtonProps) {
  const { hasAnyPermission } = usePermissions();
  const { startImpersonation, starting, error } = useImpersonation();

  if (!hasAnyPermission(PERMISSIONS.USER_IMPERSONATE)) return null;

  return (
    <div className="space-y-1.5">
      <Button
        size="sm"
        variant="outline"
        disabled={starting}
        onClick={() => void startImpersonation(userId)}
      >
        {LABELS.impersonateUser}
      </Button>
      <p className="text-body-sm text-ink-muted">
        {LABELS.impersonateUserHint}
      </p>
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </div>
  );
}
