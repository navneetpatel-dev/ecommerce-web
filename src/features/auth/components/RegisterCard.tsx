import { UseFormReturn } from 'react-hook-form'
import Link from 'next/link'
import { FormField } from '@/shared/components/FormField'
import { FormError } from '@/shared/components/FormError'
import { OAuthButton } from './OAuthButton'
import { Button } from '@/shared/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card'

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
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Create an account</CardTitle>
        <CardDescription>Join the marketplace</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField id="name" label="Name" registration={register('name')} error={errors.name} />
          <FormField id="email" label="Email" type="email" registration={register('email')} error={errors.email} />
          <FormField id="phone" label="Phone (optional)" type="tel" registration={register('phone')} error={errors.phone} />
          <FormField id="password" label="Password" type="password" registration={register('password')} error={errors.password} />
          <FormError error={error} fallback="Registration failed" />
          <Button type="submit" className="w-full" loading={isPending}>Register</Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <OAuthButton provider="google" />
        <p className="text-sm text-ink/70">
          Already have an account? <Link href="/login" className="text-brand hover:underline">Log in</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
