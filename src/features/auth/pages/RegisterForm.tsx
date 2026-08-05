'use client'

import { useRegisterForm } from '../hooks/useRegisterForm'
import { RegisterCard } from '../components/RegisterCard'
import { AuthPageShell } from '../components/AuthPageShell'

export function RegisterForm() {
  const register = useRegisterForm()

  return (
    <AuthPageShell>
      <RegisterCard
        form={register.form}
        onSubmit={register.onSubmit}
        error={register.error}
        isPending={register.isPending}
      />
    </AuthPageShell>
  )
}
