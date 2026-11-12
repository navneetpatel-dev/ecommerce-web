"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { loginRequiredDialogStyles } from "../../styles/dialogs/dialogComponents.styles";

interface LoginRequiredDialogProps {
  open: boolean;
  title: string;
  message: string;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
  /** Create an account instead (C-06), keeping the same return path. */
  onRegister: () => void;
  onCancel: () => void;
  onCloseAutoFocus: (event: Event) => void;
}

export function LoginRequiredDialog({
  open,
  title,
  message,
  onOpenChange,
  onLogin,
  onRegister,
  onCancel,
  onCloseAutoFocus,
}: LoginRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={loginRequiredDialogStyles.content}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            {LABELS.cancel}
          </Button>
          <Button type="button" variant="outline" onClick={onRegister}>
            {LABELS.createAccount}
          </Button>
          <Button type="button" onClick={onLogin}>
            {LABELS.logIn}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
