"use client";

import { useForgotPasswordForm } from "../../hooks/password/useForgotPasswordForm.hook";
import { ForgotPasswordCard } from "../../components/password/ForgotPasswordCard.component";
import { AuthPageShell } from "../../components/shell/AuthPageShell.component";

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
