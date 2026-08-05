'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, type RegisterInput } from '../schemas/auth.schema'
import { useRegister } from '../api/auth.queries'

export function useRegisterForm() {
  const register = useRegister()
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  return {
    form,
    error: register.error as Error | null,
    isPending: register.isPending,
    onSubmit: (data: RegisterInput) => register.mutate(data),
  }
}
