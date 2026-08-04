'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ForgotPasswordSchema, type ForgotPasswordInput } from '../schemas/auth.schema'
import { useForgotPassword } from '../api/auth.queries'
import { ForgotPasswordCard } from '../components/ForgotPasswordCard'

export function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword()
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  })

  return (
    <ForgotPasswordCard
      form={form}
      onSubmit={(data) => forgotPassword.mutate(data.email)}
      isPending={forgotPassword.isPending}
      isSuccess={forgotPassword.isSuccess}
    />
  )
}
