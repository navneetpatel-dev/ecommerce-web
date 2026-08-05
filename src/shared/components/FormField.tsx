import { useId } from 'react'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface FormFieldProps {
  id: string
  label: string
  type?: string
  registration: UseFormRegisterReturn
  error?: FieldError
  placeholder?: string
  helperText?: string
}

export function FormField({ id, label, type = 'text', registration, error, placeholder, helperText }: FormFieldProps) {
  const errorId = useId()

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        error={!!error}
        aria-describedby={error ? errorId : undefined}
        {...registration}
      />
      {error && (
        <p id={errorId} role="alert" className="text-[0.8125rem] text-danger">{error.message}</p>
      )}
      {!error && helperText && (
        <p className="text-[0.8125rem] text-ink-muted">{helperText}</p>
      )}
    </div>
  )
}
