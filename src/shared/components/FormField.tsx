import { useId } from 'react'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { PasswordInputContainer } from '@/shared/containers/PasswordInputContainer'

interface FormFieldProps {
  id: string
  label: string
  type?: string
  registration: UseFormRegisterReturn
  error?: FieldError
  placeholder?: string
  helperText?: string
  autoComplete?: string
}

export function FormField({
  id,
  label,
  type = 'text',
  registration,
  error,
  placeholder,
  helperText,
  autoComplete,
}: FormFieldProps) {
  const errorId = useId()
  const isPassword = type === 'password'
  const describedBy = error ? errorId : undefined

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {isPassword ? (
        <PasswordInputContainer
          id={id}
          placeholder={placeholder}
          error={!!error}
          aria-describedby={describedBy}
          autoComplete={autoComplete}
          {...registration}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          error={!!error}
          aria-describedby={describedBy}
          autoComplete={autoComplete}
          {...registration}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="text-[0.8125rem] text-danger">{error.message}</p>
      )}
      {!error && helperText && (
        <p className="text-[0.8125rem] text-ink-muted">{helperText}</p>
      )}
    </div>
  )
}
