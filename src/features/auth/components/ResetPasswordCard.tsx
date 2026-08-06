import { UseFormReturn } from 'react-hook-form'
import { FormField } from '@/shared/components/FormField'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card'

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
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-[1.75rem] font-display">Reset password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('token')} />
          <FormField 
            id="newPassword" 
            label="New Password" 
            type="password"
            autoComplete="new-password"
            registration={register('newPassword')} 
            error={errors.newPassword} 
          />
          <FormError error={error} fallback="Reset failed or link expired." />
          <Button type="submit" className="w-full" loading={isPending}>Reset password</Button>
        </form>
      </CardContent>
    </Card>
  )
}
