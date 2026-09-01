"use client";

import { AuthPageShell } from "../components/AuthPageShell.component";
import { useOAuthCallback } from "../hooks/useOAuthCallback.hook";
import { LABELS } from "@/shared/constants/labels";

export function OAuthCallbackPage() {
  const { message } = useOAuthCallback();

  return (
    <AuthPageShell>
      <div className="rounded-md border border-line bg-surface p-8 text-center">
        <p className="text-body text-ink-muted">{message || LABELS.oauthCompletingSignIn}</p>
      </div>
    </AuthPageShell>
  );
}
