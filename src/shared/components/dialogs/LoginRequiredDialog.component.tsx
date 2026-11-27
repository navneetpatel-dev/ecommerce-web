"use client";

import { LockKeyhole } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { StatusDialog } from "./StatusDialog.component";

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
 * The sign-in interruption. On phones the actions stack in priority order
 * (Log in → Create an account → Not now).
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
    <StatusDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={LockKeyhole}
      title={title}
      description={message}
      onCloseAutoFocus={onCloseAutoFocus}
      extraAction={{ label: LABELS.signInPromptNotNow, onClick: onCancel }}
      secondaryAction={{ label: LABELS.createAccount, onClick: onRegister }}
      primaryAction={{ label: LABELS.logIn, onClick: onLogin }}
    />
  );
}
