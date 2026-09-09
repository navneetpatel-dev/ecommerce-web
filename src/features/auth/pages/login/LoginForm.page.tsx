"use client";

import { useLoginForm } from "../../hooks/login/useLoginForm.hook";
import { LoginCard } from "../../components/login/LoginCard.component";
import { AuthPageShell } from "../../components/shell/AuthPageShell.component";

export function LoginForm() {
  const login = useLoginForm();

  return (
    <AuthPageShell>
      <LoginCard
        form={login.form}
        onSubmit={login.onSubmit}
        error={login.error}
        isPending={login.isPending}
        oauthRedirect={login.redirect}
        needsVerification={login.needsVerification}
        unverifiedEmail={login.unverifiedEmail}
      />
    </AuthPageShell>
  );
}
