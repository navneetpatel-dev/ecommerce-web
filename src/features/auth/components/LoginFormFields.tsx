import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { LoginInput } from '../schemas/auth.schema'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { PasswordInputContainer } from '@/shared/containers/PasswordInputContainer'

interface LoginFormFieldsProps {
  register: UseFormRegister<LoginInput>
  errors: FieldErrors<LoginInput>
}

export function LoginFormFields({ register, errors }: LoginFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-[0.9375rem] text-danger">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInputContainer
          id="password"
          autoComplete="current-password"
          error={!!errors.password}
          {...register('password')}
        />
        {errors.password && <p className="text-[0.9375rem] text-danger">{errors.password.message}</p>}
      </div>
    </>
  )
}
