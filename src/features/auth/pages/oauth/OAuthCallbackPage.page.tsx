"use client";

import { AuthPageShell } from "../../components/shell/AuthPageShell.component";
import { useOAuthCallback } from "../../hooks/oauth/useOAuthCallback.hook";
import { LABELS } from "@/shared/constants/labels";
import { authFormsStyles } from "../../components/shell/authForms.styles";

export function OAuthCallbackPage() {
  const { message } = useOAuthCallback();

  return (
    <AuthPageShell>
      <div className={authFormsStyles.callbackContainer}>
        <p className={authFormsStyles.callbackMessage}>
          {message || LABELS.oauthCompletingSignIn}
        </p>
      </div>
    </AuthPageShell>
  );
}
