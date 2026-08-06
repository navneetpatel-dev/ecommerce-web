'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangePasswordSchema, type ChangePasswordInput } from '../schemas/auth.schema'
import { useChangePassword } from '../api/auth.queries'

export function useProfilePage() {
  const changePassword = useChangePassword()
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
  })

  return {
    form,
    error: changePassword.error as Error | null,
    isPending: changePassword.isPending,
    isSuccess: changePassword.isSuccess,
    onSubmit: (data: ChangePasswordInput) => changePassword.mutate(data),
    resetSuccess: () => {
      changePassword.reset()
      form.reset()
    },
  }
}
