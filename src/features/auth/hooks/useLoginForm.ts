'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '../schemas/auth.schema'
import { useLogin } from '../api/auth.queries'

export function useLoginForm() {
  const login = useLogin()
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  return {
    form,
    error: login.error as Error | null,
    isPending: login.isPending,
    onSubmit: (data: LoginInput) => login.mutate(data),
  }
}
