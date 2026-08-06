import { UseFormReturn } from 'react-hook-form'
import Link from 'next/link'
import { LoginFormFields } from './LoginFormFields'
import { FormError } from '@/shared/components/FormError'
import { OAuthDivider } from './OAuthDivider'
import { OAuthButton } from './OAuthButton'
import { Button } from '@/shared/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card'
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
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Card className="w-full max-w-[400px] mx-auto">
      <CardHeader>
        <CardTitle className="text-[1.75rem] font-display">{LABELS.welcomeBack}</CardTitle>
        <CardDescription>{LABELS.logInToAccount}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <LoginFormFields register={register} errors={errors} />
          <FormError error={error} fallback={LABELS.loginFailed} />
          <Button type="submit" className="w-full" loading={isPending}>
            {LABELS.logIn}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <OAuthDivider />
        <OAuthButton provider="google" />
        <p className="text-[0.9375rem] text-ink-muted">
          {LABELS.dontHaveAccount}{' '}
          <Link href={PATHS.register} className="text-brand hover:underline">
            {LABELS.register}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
