import { UseFormReturn } from 'react-hook-form'
import Link from 'next/link'
import { FormFieldFrame } from '@/shared/components/forms'
import { FormError } from '@/shared/components/FormError'
import { AuthFormCard } from './AuthFormCard'
import { Button } from '@/shared/components/ui/button'
import { PasswordInputContainer } from '@/shared/containers/PasswordInputContainer'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'

interface ResetPasswordInput {
  token: string
  newPassword: string
}

interface ResetPasswordCardProps {
  form: UseFormReturn<ResetPasswordInput>
  onSubmit: (data: ResetPasswordInput) => void
  error: Error | null
  isPending: boolean
}

export function ResetPasswordCard({ form, onSubmit, error, isPending }: ResetPasswordCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <AuthFormCard
      title={LABELS.resetPasswordTitle}
      description={LABELS.resetPasswordHint}
      footer={
        <Link
          href={PATHS.login}
          className="block text-center text-[0.9375rem] font-medium text-brand transition-colors hover:text-brand-hover hover:underline"
        >
          {LABELS.backToLogin}
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register('token')} />
        <FormFieldFrame
          label={LABELS.newPassword}
          htmlFor="newPassword"
          required
          error={errors.newPassword?.message}
        >
          <PasswordInputContainer
            id="newPassword"
            autoComplete="new-password"
            error={!!errors.newPassword}
            {...register('newPassword')}
          />
        </FormFieldFrame>
        <FormError error={error} fallback={LABELS.resetPasswordFailed} />
        <Button type="submit" className="w-full" size="lg" loading={isPending}>
          {LABELS.resetPassword}
        </Button>
      </form>
    </AuthFormCard>
  )
}
