'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { LoginSchema, type LoginInput } from '../schemas/auth.schema'
import { useLogin } from '../api/auth.queries'
import { isLoginRoleSelection, type LoginRoleAccount } from '../api/auth.api'
import type { RoleName } from '@/shared/constants/labels'

export function useLoginForm() {
  const login = useLogin()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [roleAccounts, setRoleAccounts] = useState<LoginRoleAccount[] | null>(null)
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = (data: LoginInput) => {
    login.mutate(
      { ...data, redirect },
      {
        onSuccess: (result) => {
          if (isLoginRoleSelection(result)) {
            setRoleAccounts(result.accounts)
          } else {
            setRoleAccounts(null)
          }
        },
      },
    )
  }

  const onSelectRole = (role: RoleName) => {
    const values = form.getValues()
    onSubmit({ ...values, role })
  }

  const clearRoleSelection = () => {
    setRoleAccounts(null)
    form.setValue('role', undefined)
  }

  return {
    form,
    error: login.error as Error | null,
    isPending: login.isPending,
    roleAccounts,
    onSubmit,
    onSelectRole,
    clearRoleSelection,
  }
}
