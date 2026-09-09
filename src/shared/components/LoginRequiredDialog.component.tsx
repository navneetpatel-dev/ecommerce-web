"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { loginRequiredDialogStyles } from "./dialogComponents.styles";

interface LoginRequiredDialogProps {
  open: boolean;
  title: string;
  message: string;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
  onCancel: () => void;
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
      <DialogContent className={loginRequiredDialogStyles.content}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onLogin}>
            Log in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
