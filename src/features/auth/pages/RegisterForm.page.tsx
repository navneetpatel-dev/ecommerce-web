"use client";

import { useRegisterForm } from "../hooks/useRegisterForm.hook";
import { RegisterCard } from "../components/RegisterCard.component";
import { AuthPageShell } from "../components/AuthPageShell.component";

export function RegisterForm() {
  const register = useRegisterForm();

  return (
    <AuthPageShell>
      <RegisterCard
        form={register.form}
        onSubmit={register.onSubmit}
        error={register.error}
        isPending={register.isPending}
      />
    </AuthPageShell>
  );
}
