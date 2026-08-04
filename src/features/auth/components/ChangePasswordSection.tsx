import { UseFormReturn } from 'react-hook-form'
import { FormField } from '@/shared/components/FormField'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'

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
}

export function ChangePasswordSection({ form, onSubmit, error, isPending, isSuccess }: ChangePasswordSectionProps) {
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <p className="text-sm text-success">Password changed successfully.</p>
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
            <Button type="submit" loading={isPending}>Change password</Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
