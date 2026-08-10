import type { ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/cn'

interface SelectableOptionButtonProps {
  selected?: boolean
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

/**
 * Full-width selectable row for bottom sheets / option lists.
 * Keeps height aligned with shared Button (`h-11`).
 */
export function SelectableOptionButton({
  selected = false,
  children,
  onClick,
  className,
  disabled,
  type = 'button',
}: SelectableOptionButtonProps) {
  return (
    <Button
      type={type}
      variant="outline"
      fullWidth
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'justify-start px-4 font-normal',
        selected && 'border-brand bg-brand-subtle font-medium text-brand hover:bg-brand-subtle hover:text-brand',
        className,
      )}
    >
      {children}
    </Button>
  )
}
