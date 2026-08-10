import { UseFormReturn } from 'react-hook-form'
import Link from 'next/link'
import { LoginFormFields } from './LoginFormFields'
import { AuthFormCard } from './AuthFormCard'
import { FormError } from '@/shared/components/FormError'
import { OAuthDivider } from './OAuthDivider'
import { OAuthButton } from './OAuthButton'
import { Button } from '@/shared/components/ui/button'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import type { LoginInput } from '../schemas/auth.schema'

interface LoginCardProps {
  form: UseFormReturn<LoginInput>
  onSubmit: (data: LoginInput) => void
  error: Error | null
  isPending: boolean
}

export function LoginCard({ form, onSubmit, error, isPending }: LoginCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <AuthFormCard
      title={LABELS.welcomeBack}
      description={LABELS.logInToAccount}
      footer={
        <p className="text-center text-[0.9375rem] text-ink-muted">
          {LABELS.dontHaveAccount}{' '}
          <Link
            href={PATHS.register}
            className="font-medium text-brand transition-colors hover:text-brand-hover hover:underline"
          >
            {LABELS.register}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <LoginFormFields register={register} errors={errors} />
        <FormError error={error} fallback={LABELS.loginFailed} />
        <Button type="submit" className="w-full" size="lg" loading={isPending}>
          {LABELS.logIn}
        </Button>
      </form>

      <div className="space-y-3">
        <OAuthDivider />
        <OAuthButton provider="google" />
      </div>
    </AuthFormCard>
  )
}
