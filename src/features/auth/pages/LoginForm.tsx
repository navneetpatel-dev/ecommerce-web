'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '../schemas/auth.schema'
import { useLogin } from '../api/auth.queries'
import { LoginCard } from '../components/LoginCard'

export function LoginForm() {
  const login = useLogin()
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  return (
    <LoginCard
      form={form}
      onSubmit={(data) => login.mutate(data)}
      error={login.error as Error | null}
      isPending={login.isPending}
    />
  )
}
