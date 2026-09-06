"use client";

import { useAuthStore } from "@/shared/stores/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { Button } from "@/shared/components/ui/button";
import { useImpersonation } from "../hooks/useImpersonation.hook";

/** Persistent, high-visibility bar shown for the duration of a support impersonation session. */
export function ImpersonationBanner() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { isImpersonating, exitImpersonation } = useImpersonation();

  if (!isImpersonating || !currentUser) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-warning px-4 py-2 text-body-sm font-medium text-ink">
      <span>
        {formatLabel(LABELS.viewingAsBanner, { name: currentUser.name })}
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-ink/30 bg-transparent text-ink hover:bg-ink/10"
        onClick={exitImpersonation}
      >
        {LABELS.exitImpersonation}
      </Button>
    </div>
  );
}
