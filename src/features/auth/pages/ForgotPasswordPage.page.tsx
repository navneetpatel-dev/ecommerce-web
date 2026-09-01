"use client";

import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm.hook";
import { ForgotPasswordCard } from "../components/ForgotPasswordCard.component";
import { AuthPageShell } from "../components/AuthPageShell.component";

export function ForgotPasswordPage() {
  const forgot = useForgotPasswordForm();

  return (
    <AuthPageShell>
      <ForgotPasswordCard
        form={forgot.form}
        onSubmit={forgot.onSubmit}
        isPending={forgot.isPending}
        isSuccess={forgot.isSuccess}
        formLevelError={forgot.formLevelError}
      />
    </AuthPageShell>
  );
}
