'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, type RegisterInput } from '../schemas/auth.schema'
import { useRegister } from '../api/auth.queries'
import { RegisterCard } from '../components/RegisterCard'

export function RegisterForm() {
  const register = useRegister()
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  return (
    <RegisterCard
      form={form}
      onSubmit={(data) => register.mutate(data)}
      error={register.error as Error | null}
      isPending={register.isPending}
    />
  )
}
