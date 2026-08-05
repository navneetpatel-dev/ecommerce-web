'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-sm border bg-surface px-4 text-[0.9375rem] transition-colors file:border-0 file:bg-transparent file:text-[0.8125rem] file:font-medium placeholder:text-ink-faint focus-visible:outline-hidden focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger" : "border-line",
          className
        )}
        ref={ref}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false)
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { Input, PasswordInput }
