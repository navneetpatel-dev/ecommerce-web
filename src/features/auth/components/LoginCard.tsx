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
import type { LoginRoleAccount } from '../api/auth.api'
import type { RoleName } from '@/shared/constants/labels'

interface LoginCardProps {
  form: UseFormReturn<LoginInput>
  onSubmit: (data: LoginInput) => void
  onSelectRole?: (role: RoleName) => void
  onBackFromRoleSelect?: () => void
  roleAccounts?: LoginRoleAccount[] | null
  error: Error | null
  isPending: boolean
}

export function LoginCard({
  form,
  onSubmit,
  onSelectRole,
  onBackFromRoleSelect,
  roleAccounts,
  error,
  isPending,
}: LoginCardProps) {
  const { register, handleSubmit, formState: { errors } } = form
  const selectingRole = Boolean(roleAccounts?.length)

  return (
    <Card className="w-full max-w-[400px] mx-auto">
      <CardHeader>
        <CardTitle className="text-[1.75rem] font-display">
          {selectingRole ? LABELS.chooseAccount : LABELS.welcomeBack}
        </CardTitle>
        <CardDescription>
          {selectingRole ? LABELS.chooseAccountHint : LABELS.logInToAccount}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectingRole ? (
          <div className="space-y-3">
            {roleAccounts!.map((account) => (
              <Button
                key={account.role}
                type="button"
                variant="outline"
                className="w-full justify-start"
                loading={isPending}
                onClick={() => onSelectRole?.(account.role)}
              >
                {account.label}
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={isPending}
              onClick={onBackFromRoleSelect}
            >
              {LABELS.backToLogin}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <LoginFormFields register={register} errors={errors} />
            <FormError error={error} fallback={LABELS.loginFailed} />
            <Button type="submit" className="w-full" loading={isPending}>
              {LABELS.logIn}
            </Button>
          </form>
        )}
      </CardContent>
      {!selectingRole && (
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
      )}
    </Card>
  )
}
