'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangePasswordSchema, type ChangePasswordInput } from '../schemas/auth.schema'
import { useChangePassword } from '../api/auth.queries'
import { ChangePasswordSection } from '../components/ChangePasswordSection'

export function ProfilePage() {
  const changePassword = useChangePassword()
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
  })

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="font-display text-2xl font-semibold">Account Settings</h1>
      <ChangePasswordSection
        form={form}
        onSubmit={(data) => changePassword.mutate(data)}
        error={changePassword.error as Error | null}
        isPending={changePassword.isPending}
        isSuccess={changePassword.isSuccess}
      />
    </div>
  )
}
