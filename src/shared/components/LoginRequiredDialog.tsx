'use client'

import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface LoginRequiredDialogProps {
  open: boolean
  title: string
  message: string
  onOpenChange: (open: boolean) => void
  onLogin: () => void
  onCancel: () => void
}

export function LoginRequiredDialog({
  open,
  title,
  message,
  onOpenChange,
  onLogin,
  onCancel,
}: LoginRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onLogin}>
            Log in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
