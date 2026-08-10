'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const buttonVariants = cva(
  'inline-flex box-border items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-medium leading-none transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'border border-transparent bg-ink text-paper hover:bg-ink/90',
        destructive: 'border border-transparent bg-danger text-paper hover:bg-danger/90',
        outline: 'border border-line bg-surface text-ink hover:bg-paper hover:text-ink',
        secondary: 'border border-line bg-surface text-ink hover:bg-paper',
        ghost: 'border border-transparent hover:bg-brand-subtle hover:text-ink',
        link: 'border border-transparent text-brand underline-offset-4 hover:underline',
      },
      size: {
        /** Standard CTA / form actions — 44px. */
        default: 'h-11 min-h-11 px-5 sm:px-6 rounded-md text-[0.9375rem] [&_svg]:size-5',
        /**
         * Page headers, toolbars, paired actions — 40px.
         * Keep siblings on this size so rows align. Table menus override via TABLE_ROW_MENU_BUTTON_LAYOUT.
         */
        sm: 'h-10 min-h-10 px-3.5 sm:px-4 rounded-md text-[0.8125rem] sm:text-[0.875rem] [&_svg]:size-4',
        lg: 'h-11 min-h-11 px-5 sm:px-6 rounded-md text-[0.9375rem] [&_svg]:size-5',
        /** Square control matching `default` height. */
        icon: 'h-11 min-h-11 w-11 rounded-md px-0 [&_svg]:size-5',
        /** Square control matching `sm` height — use beside `size="sm"` buttons. */
        'icon-sm': 'h-10 min-h-10 w-10 rounded-md px-0 [&_svg]:size-4',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, fullWidth, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading ? true : undefined}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
