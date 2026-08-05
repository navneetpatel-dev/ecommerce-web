import { UseFormReturn } from 'react-hook-form'
import Link from 'next/link'
import { FormField } from '@/shared/components/FormField'
import { Button } from '@/shared/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card'

interface ForgotPasswordInput {
  email: string
}

interface ForgotPasswordCardProps {
  form: UseFormReturn<ForgotPasswordInput>
  onSubmit: (data: ForgotPasswordInput) => void
  isPending: boolean
  isSuccess: boolean
}

export function ForgotPasswordCard({ form, onSubmit, isPending, isSuccess }: ForgotPasswordCardProps) {
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-[1.75rem] font-display">Forgot password</CardTitle>
        <CardDescription>Enter your email and we'll send you a reset link</CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <p className="text-[0.9375rem] text-success">If that email exists, a reset link has been sent.</p>
        ) : (
          <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
            <FormField id="email" label="Email" type="email" registration={register('email')} error={errors.email} />
            <Button type="submit" className="w-full" loading={isPending}>Send reset link</Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/login" className="text-[0.9375rem] text-brand hover:underline">Back to login</Link>
      </CardFooter>
    </Card>
  )
}
