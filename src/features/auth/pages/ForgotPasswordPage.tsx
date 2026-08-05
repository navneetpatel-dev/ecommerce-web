'use client'

import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm'
import { ForgotPasswordCard } from '../components/ForgotPasswordCard'
import { AuthPageShell } from '../components/AuthPageShell'

export function ForgotPasswordPage() {
  const forgot = useForgotPasswordForm()

  return (
    <AuthPageShell>
      <ForgotPasswordCard
        form={forgot.form}
        onSubmit={forgot.onSubmit}
        isPending={forgot.isPending}
        isSuccess={forgot.isSuccess}
      />
    </AuthPageShell>
  )
}
