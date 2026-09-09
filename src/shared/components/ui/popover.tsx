'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/shared/utils/dom/cn'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    {
      className,
      align = 'center',
      sideOffset = 4,
      onCloseAutoFocus,
      onPointerDownOutside,
      onEscapeKeyDown,
      ...props
    },
    ref
  ) => {
    const closedByPointerRef = React.useRef(false)

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'z-50 w-72 rounded-md border border-line bg-surface-raised p-4 shadow-elevation-2 animate-scale-in outline-none',
            className
          )}
          onPointerDownOutside={(event) => {
            closedByPointerRef.current = true
            onPointerDownOutside?.(event)
          }}
          onEscapeKeyDown={(event) => {
            closedByPointerRef.current = false
            onEscapeKeyDown?.(event)
          }}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event)
            if (event.defaultPrevented) return
            if (closedByPointerRef.current) {
              event.preventDefault()
            }
            closedByPointerRef.current = false
          }}
          {...props}
        />
      </PopoverPrimitive.Portal>
    )
  }
)
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
