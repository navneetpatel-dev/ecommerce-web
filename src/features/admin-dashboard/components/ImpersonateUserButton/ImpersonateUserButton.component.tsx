"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { impersonateUserButtonStyles } from "./impersonateUserButton.styles";
import { useImpersonateUserButton } from "./useImpersonateUserButton.hook";

export interface ImpersonateUserButtonProps {
  userId: string;
}

/** Support "log in as user" trigger — only rendered for callers with USER_IMPERSONATE. */
export function ImpersonateUserButton({ userId }: ImpersonateUserButtonProps) {
  const { isAllowed, starting, error, handleStartImpersonation } =
    useImpersonateUserButton(userId);

  if (!isAllowed) return null;

  return (
    <div className={impersonateUserButtonStyles.root}>
      <Button
        size="sm"
        variant="outline"
        disabled={starting}
        onClick={handleStartImpersonation}
      >
        {LABELS.impersonateUser}
      </Button>
      <p className={impersonateUserButtonStyles.hint}>
        {LABELS.impersonateUserHint}
      </p>
      {error ? (
        <p className={impersonateUserButtonStyles.error}>{error}</p>
      ) : null}
    </div>
  );
}
