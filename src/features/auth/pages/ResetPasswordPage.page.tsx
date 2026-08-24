"use client";

import { useResetPasswordForm } from "../hooks/useResetPasswordForm.hook";
import { ResetPasswordCard } from "../components/ResetPasswordCard.component";
import { AuthPageShell } from "../components/AuthPageShell.component";

export function ResetPasswordPage() {
  const reset = useResetPasswordForm();

  return (
    <AuthPageShell>
      <ResetPasswordCard
        form={reset.form}
        onSubmit={reset.onSubmit}
        error={reset.error}
        isPending={reset.isPending}
      />
    </AuthPageShell>
  );
}
