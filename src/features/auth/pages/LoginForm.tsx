'use client'

import { useLoginForm } from '../hooks/useLoginForm'
import { LoginCard } from '../components/LoginCard'
import { AuthPageShell } from '../components/AuthPageShell'

export function LoginForm() {
  const login = useLoginForm()

  return (
    <AuthPageShell>
      <LoginCard
        form={login.form}
        onSubmit={login.onSubmit}
        error={login.error}
        isPending={login.isPending}
      />
    </AuthPageShell>
  )
}
