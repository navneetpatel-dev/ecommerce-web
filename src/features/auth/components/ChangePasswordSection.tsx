import { UseFormReturn } from 'react-hook-form'
import { FormField } from '@/shared/components/FormField'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'

interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

interface ChangePasswordSectionProps {
  form: UseFormReturn<ChangePasswordInput>
  onSubmit: (data: ChangePasswordInput) => void
  error: Error | null
  isPending: boolean
  isSuccess: boolean
  onChangeAgain?: () => void
}

export function ChangePasswordSection({
  form,
  onSubmit,
  error,
  isPending,
  isSuccess,
  onChangeAgain,
}: ChangePasswordSectionProps) {
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <div className="border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6">
      <h2 className="font-display text-[1.125rem] text-ink">Change password</h2>
      <p className="mt-1 text-[0.875rem] text-ink-muted">
        Use a strong password you don&apos;t reuse elsewhere.
      </p>

      <div className="mt-5">
        {isSuccess ? (
          <div className="space-y-3">
            <p className="text-[0.9375rem] text-success">Password changed successfully.</p>
            {onChangeAgain ? (
              <Button type="button" variant="outline" onClick={onChangeAgain}>
                Change again
              </Button>
            ) : null}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              id="currentPassword"
              label="Current Password"
              type="password"
              registration={register('currentPassword')}
              error={errors.currentPassword}
            />
            <FormField
              id="newPassword"
              label="New Password"
              type="password"
              registration={register('newPassword')}
              error={errors.newPassword}
            />
            <FormError error={error} fallback="Could not change password." />
            <Button type="submit" loading={isPending}>
              Change password
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
