'use client'

import { useResetPasswordForm } from '../hooks/useResetPasswordForm'
import { ResetPasswordCard } from '../components/ResetPasswordCard'
import { AuthPageShell } from '../components/AuthPageShell'

export function ResetPasswordPage() {
  const reset = useResetPasswordForm()

  return (
    <AuthPageShell>
      <ResetPasswordCard
        form={reset.form}
        onSubmit={reset.onSubmit}
        error={reset.error}
        isPending={reset.isPending}
      />
    </AuthPageShell>
  )
}
