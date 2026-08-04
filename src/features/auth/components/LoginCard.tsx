import { UseFormReturn } from 'react-hook-form'
import Link from 'next/link'
import { LoginFormFields } from './LoginFormFields'
import { FormError } from '@/shared/components/FormError'
import { OAuthDivider } from './OAuthDivider'
import { OAuthButton } from './OAuthButton'
import { Button } from '@/shared/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card'

interface LoginCardProps {
  form: UseFormReturn<any>
  onSubmit: (data: any) => void
  error: Error | null
  isPending: boolean
}

export function LoginCard({ form, onSubmit, error, isPending }: LoginCardProps) {
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Welcome back</CardTitle>
        <CardDescription>Log in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <LoginFormFields register={register} errors={errors} />
          <FormError error={error} fallback="Login failed" />
          <Button type="submit" className="w-full" loading={isPending}>Log in</Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <OAuthDivider />
        <OAuthButton provider="google" />
        <p className="text-sm text-ink/70">
          Don't have an account? <Link href="/register" className="text-brand hover:underline">Register</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
