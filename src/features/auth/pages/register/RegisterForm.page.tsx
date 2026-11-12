"use client";

import { useRegisterForm } from "../../hooks/register/useRegisterForm.hook";
import { RegisterCard } from "../../components/register/RegisterCard.component";
import { useGoogleSignInEnabled } from "../../hooks/oauth/useGoogleSignInEnabled.hook";
import { AuthPageShell } from "../../components/shell/AuthPageShell.component";

export function RegisterForm() {
  const googleSignInEnabled = useGoogleSignInEnabled();
  const register = useRegisterForm();

  return (
    <AuthPageShell>
      <RegisterCard
        form={register.form}
        onSubmit={register.onSubmit}
        error={register.error}
        isPending={register.isPending}
        isSuccess={register.isSuccess}
        registeredEmail={register.registeredEmail}
        googleSignInEnabled={googleSignInEnabled}
      />
    </AuthPageShell>
  );
}
