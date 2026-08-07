'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { LABELS } from '@/shared/constants/labels'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 animate-fade-in bg-overlay', className)}
    style={{ animationDuration: 'var(--motion-moderate)' }}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(
  (
    {
      className,
      children,
      onCloseAutoFocus,
      onPointerDownOutside,
      onEscapeKeyDown,
      ...props
    },
    ref
  ) => {
    const closedByPointerRef = React.useRef(false)

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-[480px] max-h-[calc(100dvh-2rem)] -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto border border-line bg-surface-raised p-5 shadow-elevation-3 animate-scale-in outline-none rounded-lg sm:gap-6 sm:p-6',
            className
          )}
          style={{ animationDuration: 'var(--motion-moderate)' }}
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
        >
          {children}
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-sm opacity-70 outline-none hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            onPointerDown={() => {
              closedByPointerRef.current = true
            }}
          >
            <X size={20} />
            <span className="sr-only">{LABELS.close}</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-footer"
    className={cn('dialog-footer', className)}
    {...props}
  />
)

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-[1.375rem] font-semibold leading-tight tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-[0.8125rem] text-ink-muted', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
