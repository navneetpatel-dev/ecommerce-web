"use client";

import { useResetPasswordForm } from "../../hooks/password/useResetPasswordForm.hook";
import { ResetPasswordCard } from "../../components/password/ResetPasswordCard.component";
import { AuthPageShell } from "../../components/shell/AuthPageShell.component";

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
