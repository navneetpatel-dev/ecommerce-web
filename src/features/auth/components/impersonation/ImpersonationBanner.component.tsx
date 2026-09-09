"use client";

import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { Button } from "@/shared/components/ui/button";
import { useImpersonation } from "../../hooks/impersonation/useImpersonation.hook";
import { authFormsStyles } from "../shell/authForms.styles";

/** Persistent, high-visibility bar shown for the duration of a support impersonation session. */
export function ImpersonationBanner() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { isImpersonating, exitImpersonation } = useImpersonation();

  if (!isImpersonating || !currentUser) return null;

  return (
    <div className={authFormsStyles.impersonationBanner}>
      <span>
        {formatLabel(LABELS.viewingAsBanner, { name: currentUser.name })}
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={authFormsStyles.impersonationButton}
        onClick={exitImpersonation}
      >
        {LABELS.exitImpersonation}
      </Button>
    </div>
  );
}
