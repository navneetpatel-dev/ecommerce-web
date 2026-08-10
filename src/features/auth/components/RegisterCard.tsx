import { UseFormReturn } from 'react-hook-form'
import Link from 'next/link'
import { FormFieldFrame } from '@/shared/components/forms'
import { FormError } from '@/shared/components/FormError'
import { AuthFormCard } from './AuthFormCard'
import { OAuthDivider } from './OAuthDivider'
import { OAuthButton } from './OAuthButton'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { PasswordInputContainer } from '@/shared/containers/PasswordInputContainer'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'

interface RegisterInput {
  name: string
  email: string
  phone?: string
  password: string
}

interface RegisterCardProps {
  form: UseFormReturn<RegisterInput>
  onSubmit: (data: RegisterInput) => void
  error: Error | null
  isPending: boolean
}

export function RegisterCard({ form, onSubmit, error, isPending }: RegisterCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <AuthFormCard
      title={LABELS.createAccount}
      description={LABELS.createAccountHint}
      footer={
        <p className="text-center text-[0.9375rem] text-ink-muted">
          {LABELS.alreadyHaveAccount}{' '}
          <Link
            href={PATHS.login}
            className="font-medium text-brand transition-colors hover:text-brand-hover hover:underline"
          >
            {LABELS.logIn}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormFieldFrame label={LABELS.name} htmlFor="name" required error={errors.name?.message}>
          <Input id="name" autoComplete="name" error={Boolean(errors.name)} {...register('name')} />
        </FormFieldFrame>
        <FormFieldFrame label={LABELS.email} htmlFor="email" required error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            error={Boolean(errors.email)}
            {...register('email')}
          />
        </FormFieldFrame>
        <FormFieldFrame label={LABELS.phoneOptional} htmlFor="phone" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            error={Boolean(errors.phone)}
            {...register('phone')}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.password}
          htmlFor="password"
          required
          error={errors.password?.message}
        >
          <PasswordInputContainer
            id="password"
            autoComplete="new-password"
            error={!!errors.password}
            {...register('password')}
          />
        </FormFieldFrame>
        <FormError error={error} fallback={LABELS.registrationFailed} />
        <Button type="submit" className="w-full" size="lg" loading={isPending}>
          {LABELS.register}
        </Button>
      </form>

      <div className="space-y-3">
        <OAuthDivider />
        <OAuthButton provider="google" />
      </div>
    </AuthFormCard>
  )
}
