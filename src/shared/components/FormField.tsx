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
}

export function FormField({ id, label, type = 'text', registration, error, placeholder }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...registration} />
      {error && <p className="text-sm text-danger">{error.message}</p>}
    </div>
  )
}
