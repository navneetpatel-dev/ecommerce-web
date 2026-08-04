'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { ResetPasswordSchema, type ResetPasswordInput } from '../schemas/auth.schema'
import { useResetPassword } from '../api/auth.queries'
import { ResetPasswordCard } from '../components/ResetPasswordCard'

export function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const resetPassword = useResetPassword()
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token: searchParams.get('token') || '' },
  })

  return (
    <ResetPasswordCard
      form={form}
      onSubmit={(data) => resetPassword.mutate(data)}
      error={resetPassword.error as Error | null}
      isPending={resetPassword.isPending}
    />
  )
}
