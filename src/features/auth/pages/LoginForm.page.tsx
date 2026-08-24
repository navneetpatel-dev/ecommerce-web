"use client";

import { useLoginForm } from "../hooks/useLoginForm.hook";
import { LoginCard } from "../components/LoginCard.component";
import { AuthPageShell } from "../components/AuthPageShell.component";

export function LoginForm() {
  const login = useLoginForm();

  return (
    <AuthPageShell>
      <LoginCard
        form={login.form}
        onSubmit={login.onSubmit}
        error={login.error}
        isPending={login.isPending}
      />
    </AuthPageShell>
  );
}
