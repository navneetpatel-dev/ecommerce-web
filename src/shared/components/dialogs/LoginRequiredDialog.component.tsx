"use client";

import { LockKeyhole } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { loginRequiredDialogStyles as styles } from "../../styles/dialogs/dialogComponents.styles";

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

/**
 * The sign-in interruption. Actions stack full-width in priority order
 * (Log in → Create an account → Not now) so none of them wraps on its own.
 */
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
        className={styles.content}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DialogHeader className={styles.header}>
          <span className={styles.iconWrap} aria-hidden>
            <LockKeyhole className={styles.icon} />
          </span>
          <DialogTitle className={styles.title}>{title}</DialogTitle>
          <DialogDescription className={styles.description}>
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className={styles.actions}>
          <Button type="button" className={styles.action} onClick={onLogin}>
            {LABELS.logIn}
          </Button>
          <Button
            type="button"
            variant="outline"
            className={styles.action}
            onClick={onRegister}
          >
            {LABELS.createAccount}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={styles.action}
            onClick={onCancel}
          >
            {LABELS.signInPromptNotNow}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
